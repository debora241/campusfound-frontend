import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2, "Required"),
  address: z.string().min(2, "Required"),
  phone: z.string().min(6, "Required"),
  email: z.string().email("Enter a valid email"),
});
type FormValues = z.infer<typeof schema>;

export function SchoolSettings() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "Lycée Bilingue de Douala",
      address: "Rue de la Réunification, Douala",
      phone: "+237 233 42 10 88",
      email: "admin@lyceebdouala.cm",
    },
  });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 500));
    toast.success("School profile updated");
  };

  return (
    <div>
      <PageHeader title="Settings" description="School profile and preferences" />
      <Card className="max-w-xl">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <Label htmlFor="name">School name</Label>
              <Input id="name" error={errors.name?.message} {...register("name")} />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" error={errors.address?.message} {...register("address")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" error={errors.phone?.message} {...register("phone")} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" error={errors.email?.message} {...register("email")} />
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
