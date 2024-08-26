"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";



const genders = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
] as const;

const areaCodes = [
  { label: "United States", value: "+1US" },
  { label: "India", value: "+91IN" },
  { label: "Ghana", value: "+233GH" },
] as const;

const countries = [
  { label: "United States", value: "unitedstates" },
  { label: "India", value: "india" },
  { label: "Ghana", value: "ghana" },
] as const;

const accountFormSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: "First name must be at least 2 characters.",
    })
    .max(30, {
      message: "First name must not be longer than 30 characters.",
    }),
  lastName: z
    .string()
    .min(2, {
      message: "Last name must be at least 2 characters.",
    })
    .max(30, {
      message: "Last name must not be longer than 30 characters.",
    }),
  gender: z.string({
    required_error: "Please select a gender.",
  }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  country: z.string({
    required_error: "Please select a country.",
  }),
  city: z.string({
    required_error: "Please enter a city.",
  }),
  zipCode: z.string({
    required_error: "Please enter a zip code.",
  }),
  areaCode: z.string({
    required_error: "Please enter a zip code.",
  }),
  phoneNumber: z
    .string()
    .min(10, {
      message: "Phone number must be 10 characters.",
    })
    .max(10, {
      message: "Phone number must be 10 characters.",
    }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  firstName: "",
  lastName: "",
  areaCode: "+1US",
  city: "",
  country: "",
  gender: "",
  phoneNumber: "",
  dob: new Date("2023-01-23"),
};

export function GeneralForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  function onSubmit(data: AccountFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* first name */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Your first name" {...field} />
              </FormControl>
              <FormDescription>
                This is the first name that will be displayed on your profile and in
                emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* last name */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Your last name" {...field} />
              </FormControl>
              <FormDescription>
                This is the last name that will be displayed on your profile and in
                emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={date =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Your gender" {...field}/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {genders.map(({ label, value }) => (
                        <SelectItem value={label} key={value}>{label}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                This is the gender that will be displayed in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Your country" {...field}/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {countries.map(({ label, value }) => (
                        <SelectItem value={label} key={value}>{label}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                This is the country that will be displayed in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* city name */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Your city name" {...field} />
              </FormControl>
              <FormDescription>
                This is the city name that will be displayed in the dashboard
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* zip code */}
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input placeholder="Your zip code" {...field} />
              </FormControl>
              <FormDescription>
                This is the zip code that will be displayed in the dashboard
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* area code */}
        <div className="flex flex-col">
          <div className="flex flex-row gap-x-2">
            <FormField
              control={form.control}
              name="areaCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area Code</FormLabel>
                  <FormControl>
                    <Select>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="+1US" {...field}/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {areaCodes.map(({ label, value }) => (
                            <SelectItem value={label} key={value}>{value}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* phone number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Your zip code" {...field} className="m-0"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormDescription className="mt-2">
            This is the zip code that will be displayed in the dashboard
          </FormDescription>
        </div>
        <Button type="submit">Update account</Button>
      </form>
    </Form>
  );
}