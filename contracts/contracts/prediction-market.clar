;; Error codes
(define-constant ERR-EVENT-EXISTS (err u100))
(define-constant ERR-NO-EVENT (err u101))
(define-constant ERR-SESSION-NOT-STARTED (err u102))
(define-constant ERR-SESSION-ENDED (err u103))
(define-constant ERR-INSUFFICIENT-FUNDS (err u104))
(define-constant ERR-UNAUTHORIZED (err u107))
(define-constant ERR-TRANSFER-FAILED (err u108))
(define-constant ERR-OPPOSITE-SIDE-BET (err u109))

;; Data maps
(define-map events 
  (string-utf8 100) 
  { 
    name: (string-utf8 100), 
    description: (string-utf8 100),
    yesVoters: uint,  ;; Count of unique yes voters
    noVoters: uint,   ;; Count of unique no voters
    yesPot: uint,   ;; Total STX bet on yes
    noPot: uint,    ;; Total STX bet on no
    startSession: uint, 
    endSession: uint,
    betters: (list 50 principal)  ;; List of unique betters for this event
  }
)

;; Track bets and votes together
(define-map user-bets 
  { event-id: (string-utf8 100), user: principal }
  { total-amount: uint, vote: bool, has-voted: bool }
)

;; Principal who can add events and end sessions
(define-constant contract-owner tx-sender)

;; function to add a new event to the events mapping
(define-public (add-event 
  (event-id (string-utf8 100))
  (name (string-utf8 100))
  (description (string-utf8 100))
  (start-height uint)
  (end-height uint)
)
  (begin
    (asserts! (is-eq tx-sender contract-owner) ERR-UNAUTHORIZED)
    (asserts! (is-none (map-get? events event-id)) ERR-EVENT-EXISTS)
    
    (ok (map-set events event-id {
      name: name,
      description: description,
      yesVoters: u0,
      noVoters: u0,
      yesPot: u0,
      noPot: u0,
      startSession: start-height,
      endSession: end-height,
      betters: (list)
    }))
  )
)

;; Combined function for betting and voting
(define-public (bet (event-id (string-utf8 100)) (yes-vote bool) (bet-amount uint))
  (let (
    (event (unwrap! (map-get? events event-id) ERR-NO-EVENT))
    (current-height stacks-block-height)
    (existing-bet (map-get? user-bets {event-id: event-id, user: tx-sender}))
  )
    ;; Check if session is active
    (asserts! (>= current-height (get startSession event)) ERR-SESSION-NOT-STARTED)
    (asserts! (<= current-height (get endSession event)) ERR-SESSION-ENDED)
    
    ;; If user has already bet, check they're not betting on opposite side
    (if (is-some existing-bet)
      (let ((prev-bet (unwrap-panic existing-bet)))
        (asserts! (is-eq yes-vote (get vote prev-bet)) ERR-OPPOSITE-SIDE-BET))
      true)
    
    ;; Transfer bet amount
    (try! (stx-transfer? bet-amount tx-sender (as-contract tx-sender)))
    
    ;; Update event totals and user bet record
    (if (is-some existing-bet)
      ;; User has bet before - just add to their amount
      (let (
        (prev-bet (unwrap-panic existing-bet))
        (prev-vote (get vote prev-bet))
        (new-amount (+ (get total-amount prev-bet) bet-amount))
      )
        ;; Update total pots
        (map-set events event-id 
          (merge event 
            (if yes-vote
              {yesPot: (+ (get yesPot event) bet-amount),
               noPot: (get noPot event)}
              {yesPot: (get yesPot event),
               noPot: (+ (get noPot event) bet-amount)}
            )
          ))
        ;; Update user's total bet amount
        (ok (map-set user-bets 
          {event-id: event-id, user: tx-sender} 
          {total-amount: new-amount, 
           vote: prev-vote,
           has-voted: (get has-voted prev-bet)}))
      )
      ;; First time betting - add vote and amount
      (begin
        ;; Update event totals and add better to list
        (map-set events event-id 
          (merge event 
            (if yes-vote
              {yesPot: (+ (get yesPot event) bet-amount),
               yesVoters: (+ (get yesVoters event) u1),
               noPot: (get noPot event),
               noVoters: (get noVoters event),
               betters: (unwrap-panic (as-max-len? (append (get betters event) tx-sender) u50))}
              {yesPot: (get yesPot event),
               yesVoters: (get yesVoters event),
               noPot: (+ (get noPot event) bet-amount),
               noVoters: (+ (get noVoters event) u1),
               betters: (unwrap-panic (as-max-len? (append (get betters event) tx-sender) u50))}
            )
          ))
        ;; Record new bet and vote
        (ok (map-set user-bets 
          {event-id: event-id, user: tx-sender} 
          {total-amount: bet-amount, 
           vote: yes-vote,
           has-voted: true}))
      )
    )
  )
)

;; Helper function to calculate and distribute winnings
(define-private (distribute-winnings (user principal) 
                   (winning-data {total-pot: uint, winning-pot: uint, winning-side: bool, event-id: (string-utf8 100)}))
  (let (
    (bet-info (unwrap-panic (map-get? user-bets 
      {event-id: (get event-id winning-data), user: user})))
  )
    (if (is-eq (get vote bet-info) (get winning-side winning-data))
      (let (
        ;; Calculate user's proportion of winning pot
        (user-proportion (/ (* (get total-amount bet-info) u100) (get winning-pot winning-data)))
        ;; Calculate user's winnings from total pot
        (user-winnings (/ (* (get total-pot winning-data) user-proportion) u100))
      )
        ;; Transfer winnings to user
        (try! (as-contract (stx-transfer? user-winnings tx-sender user)))
        (ok user-winnings))
      (ok u0)  ;; Return 0 for losing bets
    )
  )
)

;; Function to end session and distribute winnings
(define-public (end-session (event-id (string-utf8 100)))
  (let (
    (event (unwrap! (map-get? events event-id) ERR-NO-EVENT))
    (current-height stacks-block-height)
  )
    ;; Only contract owner can end session
    (asserts! (is-eq tx-sender contract-owner) ERR-UNAUTHORIZED)
    
    ;; Check if session has ended
    (asserts! (<= current-height (get endSession event)) ERR-SESSION-ENDED)
    
    (let (
      (yes-wins (> (get yesVoters event) (get noVoters event)))
      (total-pot (+ (get yesPot event) (get noPot event)))
      (winning-pot (if yes-wins (get yesPot event) (get noPot event)))
      (all-betters (get betters event))
      (winning-data {
        total-pot: total-pot,
        winning-pot: winning-pot,
        winning-side: yes-wins,
        event-id: event-id
      })
    )
      ;; Distribute winnings to all betters
      (map distribute-winnings all-betters (list winning-data))
      
      ;; Reset event stats
      (map-set events event-id 
        (merge event {
          yesVoters: u0,
          noVoters: u0,
          yesPot: u0,
          noPot: u0,
          betters: (list)
        })
      )
      
      ;; Return results
      (ok {
        yes-won: yes-wins,
        total-pot: total-pot,
        winning-pot: winning-pot
      })
    )
  )
)

;; Read-only functions
(define-read-only (get-event (event-id (string-utf8 100)))
  (map-get? events event-id)
)

(define-read-only (get-user-bet (event-id (string-utf8 100)) (user principal))
  (map-get? user-bets {event-id: event-id, user: user})
)