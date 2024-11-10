import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createMarket } from "@/hooks/markets.hooks";
import Navbar from "@/components/Navbar";

const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  end: z.number().min(1, "End must be at least 1 block"),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function NewMarket() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: { end: 10 },
  });

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("end", data.end.toString());

      await createMarket(formData);
      window.location.href = "/";
    } catch {
      console.error("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-28 h-[calc(100vh-4rem)] flex flex-col justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Event name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Event description"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="end">End (in blocks)</Label>
                  <Input
                    id="end"
                    type="number"
                    {...register("end", { valueAsNumber: true })}
                    placeholder="Number of blocks"
                  />
                  {errors.end && (
                    <p className="text-sm text-red-500">{errors.end.message}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 mt-6">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
