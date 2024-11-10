;; Error codes
(define-constant ERR-MARKET-EXISTS (err u100))
(define-constant ERR-NO-MARKET (err u101))
(define-constant ERR-SESSION-NOT-STARTED (err u102))
(define-constant ERR-SESSION-ENDED (err u103))
(define-constant ERR-INSUFFICIENT-FUNDS (err u104))
(define-constant ERR-UNAUTHORIZED (err u107))
(define-constant ERR-TRANSFER-FAILED (err u108))
(define-constant ERR-OPPOSITE-SIDE-BET (err u109))

;; Data maps
(define-map markets 
  (string-utf8 100) 
  { 
    name: (string-utf8 100), 
    description: (string-utf8 100),
    yesVoters: uint,  ;; Count of unique yes voters
    noVoters: uint,   ;; Count of unique no voters
    yesPot: uint,   ;; Total STX bet on yes
    noPot: uint,    ;; Total STX bet on no
    endSession: uint,
    isEnded: bool,  ;; Flag to indicate if session has ended
    betters: (list 50 principal)  ;; List of unique betters for this market
  }
)

;; Track bets and votes together
(define-map user-bets 
  { market-id: (string-utf8 100), user: principal }
  { total-amount: uint, vote: bool, has-voted: bool }
)

;; Principal who can add markets and end sessions
(define-constant contract-owner tx-sender)

;; Data variable to store market IDs
(define-data-var market-ids (list 100 (string-utf8 100)) (list))

;; Function to add a new market to the markets mapping
(define-public (add-market 
  (name (string-utf8 100))
  (description (string-utf8 100))
  (end-height uint)
)
  (begin
    (let ((current-market-count (len (var-get market-ids)))
          (market-id (int-to-utf8 (+ current-market-count u1))))
      (asserts! (is-eq tx-sender contract-owner) ERR-UNAUTHORIZED)
      (asserts! (is-none (map-get? markets market-id)) ERR-MARKET-EXISTS)

      (map-set markets market-id {
        name: name,
        description: description,
        yesVoters: u0,
        noVoters: u0,
        yesPot: u0,
        noPot: u0,
        endSession: (+ stacks-block-height end-height),
        isEnded: false,
        betters: (list)
      })

      ;; Add market-id to market-ids list
      (var-set market-ids 
        (unwrap-panic (as-max-len? (append (var-get market-ids) market-id) u100)))
      (ok market-id)
    )
  )
)

;; Combined function for betting and voting
(define-public (bet (market-id (string-utf8 100)) (yes-vote bool) (bet-amount uint))
  (let (
    (market (unwrap! (map-get? markets market-id) ERR-NO-MARKET))
    (current-height stacks-block-height)
    (existing-bet (map-get? user-bets {market-id: market-id, user: tx-sender}))
  )
    ;; Check if session is active
    (asserts! (<= current-height (get endSession market)) ERR-SESSION-ENDED)
    (asserts! (not (get isEnded market)) ERR-SESSION-ENDED)
    
    ;; If user has already bet, check they're not betting on opposite side
    (if (is-some existing-bet)
      (let ((prev-bet (unwrap-panic existing-bet)))
        (asserts! (is-eq yes-vote (get vote prev-bet)) ERR-OPPOSITE-SIDE-BET))
      true)
    
    ;; Transfer bet amount
    (try! (stx-transfer? bet-amount tx-sender (as-contract tx-sender)))
    
    ;; Update market totals and user bet record
    (if (is-some existing-bet)
      ;; User has bet before - just add to their amount
      (let (
        (prev-bet (unwrap-panic existing-bet))
        (prev-vote (get vote prev-bet))
        (new-amount (+ (get total-amount prev-bet) bet-amount))
      )
        ;; Update total pots
        (map-set markets market-id 
          (merge market 
            (if yes-vote
              {yesPot: (+ (get yesPot market) bet-amount),
               noPot: (get noPot market)}
              {yesPot: (get yesPot market),
               noPot: (+ (get noPot market) bet-amount)}
            )
          ))
        ;; Update user's total bet amount
        (ok (map-set user-bets 
          {market-id: market-id, user: tx-sender} 
          {total-amount: new-amount, 
           vote: prev-vote,
           has-voted: (get has-voted prev-bet)}))
      )
      ;; First time betting - add vote and amount
      (begin
        ;; Update market totals and add better to list
        (map-set markets market-id 
          (merge market 
            (if yes-vote
              {yesPot: (+ (get yesPot market) bet-amount),
               yesVoters: (+ (get yesVoters market) u1),
               noPot: (get noPot market),
               noVoters: (get noVoters market),
               betters: (unwrap-panic (as-max-len? (append (get betters market) tx-sender) u50))}
              {yesPot: (get yesPot market),
               yesVoters: (get yesVoters market),
               noPot: (+ (get noPot market) bet-amount),
               noVoters: (+ (get noVoters market) u1),
               betters: (unwrap-panic (as-max-len? (append (get betters market) tx-sender) u50))}
            )
          ))
        ;; Record new bet and vote
        (ok (map-set user-bets 
          {market-id: market-id, user: tx-sender} 
          {total-amount: bet-amount, 
           vote: yes-vote,
           has-voted: true}))
      )
    )
  )
)

;; Add new data map for winning data
(define-map market-winning-data
  (string-utf8 100)  ;; market-id
  {
    total-pot: uint,
    winning-pot: uint,
    winning-side: bool
  }
)

;; Modified helper function that only takes one argument
(define-private (distribute-single-winner (user principal))
  (let (
    ;; Get winning data from context
    (market-id (var-get current-distribution-market))
    (winning-data (unwrap-panic (map-get? market-winning-data market-id)))
    (bet-info (unwrap-panic (map-get? user-bets 
      {market-id: market-id, user: user})))
  )
    (if (is-eq (get vote bet-info) (get winning-side winning-data))
      (let (
        (user-proportion (/ (* (get total-amount bet-info) u100) (get winning-pot winning-data)))
        (user-winnings (/ (* (get total-pot winning-data) user-proportion) u100))
      )
        (try! (as-contract (stx-transfer? user-winnings tx-sender user)))
        (ok user-winnings))
      (ok u0)
    )
  )
)

;; Data var to store current market-id being processed
(define-data-var current-distribution-market (string-utf8 100) u"")

;; Function to end market and distribute winnings
(define-public (end-market (market-id (string-utf8 100)))
  (let (
    (market (unwrap! (map-get? markets market-id) ERR-NO-MARKET))
    (current-height stacks-block-height)
  )
    ;; Only contract owner can end session
    (asserts! (is-eq tx-sender contract-owner) ERR-UNAUTHORIZED)
    
    ;; Check if session has ended
    (asserts! (not (get isEnded market)) ERR-SESSION-ENDED)
    
    (let (
      (yes-wins (> (get yesVoters market) (get noVoters market)))
      (total-pot (+ (get yesPot market) (get noPot market)))
      (winning-pot (if yes-wins (get yesPot market) (get noPot market)))
      (all-betters (get betters market))
    )
      ;; Store winning data in map
      (map-set market-winning-data market-id {
        total-pot: total-pot,
        winning-pot: winning-pot,
        winning-side: yes-wins
      })
      
      ;; Set current market being processed
      (var-set current-distribution-market market-id)
      
      ;; Distribute winnings to all betters
      (map distribute-single-winner all-betters)
      
      ;; Set market to isEnded
      (map-set markets market-id 
        (merge market {
          isEnded: true
        })
      )
      
      ;; Clear winning data after distribution
      (map-delete market-winning-data market-id)
      
      ;; Return results
      (ok {
        yes-won: yes-wins,
        total-pot: total-pot,
        winning-pot: winning-pot
      })
    )
  )
)

;; Read-only function to get a specific market
(define-read-only (get-market (market-id (string-utf8 100)))
  (map-get? markets market-id)
)

;; Read-only function to get a user's bet on an market
(define-read-only (get-user-bet (market-id (string-utf8 100)) (user principal))
  (map-get? user-bets {market-id: market-id, user: user})
)

;; Private function to check if an market is not ended
(define-private (market-not-ended? (market-id (string-utf8 100)))
  (let ((market (unwrap-panic (map-get? markets market-id))))
    (not (get isEnded market))
  )
)

;; Private function to get market data with market-id included
(define-private (get-market-data (market-id (string-utf8 100)))
  (let ((market (unwrap-panic (map-get? markets market-id))))
    ;; Return market data along with market-id
    {
      marketId: market-id,
      name: (get name market),
      description: (get description market),
      yesVoters: (get yesVoters market),
      noVoters: (get noVoters market),
      yesPot: (get yesPot market),
      noPot: (get noPot market),
      endSession: (get endSession market),
      isEnded: (get isEnded market),
      betters: (get betters market)
    }
  )
)

;; Function to get all current markets that are not ended
(define-read-only (get-current-markets)
  (let ((current-market-ids (filter market-not-ended? (var-get market-ids))))
    (map get-market-data current-market-ids)
  )
)
