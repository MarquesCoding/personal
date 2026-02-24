'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Textarea } from '@workspace/ui/components/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { Checkbox } from '@workspace/ui/components/checkbox'

const commissionSchema = z.object({
  // Personal Info
  name: z.string().min(1, 'Name is required'),
  country: z.string().min(1, 'Country is required'),
  email: z.string().email('Invalid email address'),
  confirmEmail: z.string().email('Invalid email address'),
  discordUsername: z.string().min(1, 'Discord username is required'),

  // Keyboard Info
  keyboardKitName: z.string().min(1, 'Keyboard kit name is required'),
  plateChoice: z.string().min(1, 'Plate choice is required'),
  layout: z.string().min(1, 'Layout is required'),
  stabilizers: z.string().min(1, 'Stabilizers information is required'),
  switches: z.string().min(1, 'Switches information is required'),
  switchesLubing: z.enum(['No', 'Yes', 'Yes + Films', 'Yes + Films + Springs']),
  providingKeycaps: z.enum(['Yes', 'No']),
  returnShippingInsurance: z.enum(['Yes', 'No']),
  additionalNotes: z.string().optional(),

  // Terms
  agreedToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms',
  }),
}).refine((data) => data.email === data.confirmEmail, {
  message: "Emails don't match",
  path: ["confirmEmail"],
})

type CommissionFormData = z.infer<typeof commissionSchema>

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

export function KeyboardsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CommissionFormData>({
    resolver: zodResolver(commissionSchema),
    defaultValues: {
      name: '',
      country: '',
      email: '',
      confirmEmail: '',
      discordUsername: '',
      keyboardKitName: '',
      plateChoice: '',
      layout: '',
      stabilizers: '',
      switches: '',
      switchesLubing: 'No',
      providingKeycaps: 'No',
      returnShippingInsurance: 'No',
      additionalNotes: '',
      agreedToTerms: false,
    },
  })

  const onSubmit = async (data: CommissionFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/commission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.status === 429) {
        toast.error('Too many requests. Please try again later.')
        return
      }

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.message || 'Failed to submit commission request')
        return
      }

      toast.success('Commission request submitted successfully!')
      form.reset()
    } catch (error) {
      toast.error('An error occurred. Please try again.')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.section
      className="mb-32"
      initial="initial"
      animate="animate"
      variants={{
        animate: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {/* Info Section */}
      <motion.div variants={fadeInUp} className="mb-16">
        <h2 className="font-serif text-4xl md:text-5xl font-light italic mb-8">
          Keyboard Commissions
        </h2>

        <div className="space-y-8 mb-12">
          {/* Commission Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-600 dark:text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">Commission Status: Open</span>
            </div>
          </div>

          {/* Wait Times */}
          <div className="bg-secondary/50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3">Current Wait Time</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Standard build: <span className="text-foreground font-medium">3-4 weeks*</span></li>
              <li>• Switch lubing only: <span className="text-foreground font-medium">2-4 days*</span></li>
              <li className="text-sm italic">*after parts are received</li>
            </ul>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-2xl font-medium mb-6 text-foreground">Pricing</h3>

            <div className="space-y-6">
              {/* Switch Modification */}
              <div>
                <h4 className="text-lg font-medium mb-3">Switch Modification</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Basic lubing: <span className="text-foreground">£0.75 per switch</span></li>
                  <li>• The works (lubing, filming + more): <span className="text-foreground">~£1.03 per switch</span></li>
                  <li className="text-sm italic pt-2">I provide all lubricant and oils for this process</li>
                </ul>
              </div>

              {/* Keyboard Assembly */}
              <div>
                <h4 className="text-lg font-medium mb-3">Keyboard Assembly</h4>
                <p className="text-sm text-muted-foreground mb-3">(does not include hand-wired or mill-max)</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 40%-75%: <span className="text-foreground font-medium">£39.50 GBP</span></li>
                  <li>• TKL: <span className="text-foreground font-medium">£47.50 GBP</span></li>
                  <li>• TKL+: <span className="text-foreground font-medium">£59.50 GBP</span></li>
                  <li className="text-sm italic pt-2">For mill-max sockets, please inquire!</li>
                </ul>
              </div>

              {/* Desoldering */}
              <div>
                <h4 className="text-lg font-medium mb-3">Desoldering</h4>
                <p className="text-muted-foreground">
                  Starts at <span className="text-foreground font-medium">£31.50 GBP</span>. All desoldering is done with a Hakko FR-301 Desoldering Tool.
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground italic mt-6">All prices in GBP</p>
          </div>

          {/* Shipping Notice */}
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground">Shipping Notice for UK Imports</h3>
            <p className="text-muted-foreground mb-4">
              To ensure your keyboard clears customs smoothly and avoids unnecessary duties or taxes, please follow these instructions when shipping to Canada:
            </p>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>• Use any courier (UPS, FedEx, DHL, Royal Mail, etc.)</li>
              <li>• On the customs/commercial invoice, write: <span className="text-foreground italic">"Computer keyboard – for repair & return, no sale involved"</span></li>
              <li>• HS Code: <span className="text-foreground">8471.60.90.00</span></li>
              <li>• Country of Origin: UK (or the country the keyboard was originally made in)</li>
              <li>• Declared Value: Use the original purchase value or a reasonable used value (e.g., £80)</li>
              <li>• Reason for Export: <span className="text-foreground italic">"Repair & Return"</span></li>
              <li>• Write "Repair & Return" on the box as well</li>
            </ul>
            <p className="text-muted-foreground text-sm mt-4">
              If you have any questions, please write them in the notes and I'll be happy to assist!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Important Notes */}
      <motion.div variants={fadeInUp}>
        <h3 className="text-2xl font-medium mb-6 text-foreground">Important Notes</h3>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 space-y-3">
          <p className="text-muted-foreground">
            <span className="text-foreground font-medium">Materials:</span> All materials, with the exception of lubricant, solder and dielectric grease, must be provided by the owner unless discussed otherwise.
          </p>
          <p className="text-muted-foreground">
            <span className="text-foreground font-medium">Parts:</span> All parts (stabilizers, films, etc.) must be provided if needed.
          </p>
          <p className="text-muted-foreground">
            <span className="text-foreground font-medium">Pricing:</span> Does not include return shipping and/or duties.
          </p>
          <p className="text-muted-foreground">
            <span className="text-foreground font-medium">Inspection:</span> Any kit damages present upon arrival will be noted and confirmed with you.
          </p>
          <p className="text-muted-foreground">
            <span className="text-foreground font-medium">PCB Testing:</span> PCB functionality is verified and re-tested upon arrival. You'll be notified of any issues.
          </p>
          <p className="text-muted-foreground">
            <span className="text-foreground font-medium">Extra Switches:</span> Please provide at least 5 extra switches in case of defects or switch issues.
          </p>
          <p className="text-muted-foreground">
            <span className="text-foreground font-medium">Stabilizers:</span> Provide the correct size, amount, and specify any mods needed (clipped, lubed, etc.).
          </p>
          <p className="text-muted-foreground">
            <span className="text-foreground font-medium">Keycaps:</span> Providing keycaps is optional. If streamed, a basic set will be used for testing.
          </p>
          <p className="text-muted-foreground">
            <span className="text-foreground font-medium">Lube Type:</span> Specify your preferred lube type. All switches will be lubed using my traditional lubing method.
          </p>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div variants={fadeInUp} className="mt-16">
        <h3 className="text-2xl font-medium mb-8 text-foreground">Frequently Asked Questions</h3>
        <div className="space-y-6">
          {/* Q1 */}
          <details className="group border border-border rounded-lg p-4 cursor-pointer">
            <summary className="flex items-center justify-between font-medium text-foreground hover:text-foreground/80 transition-colors">
              <span>Can you source my parts for me?</span>
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-muted-foreground mt-4">
              I can! But it will be limited to what's in stock. Payment for this will need to be made up front.
            </p>
          </details>

          {/* Q2 */}
          <details className="group border border-border rounded-lg p-4 cursor-pointer">
            <summary className="flex items-center justify-between font-medium text-foreground hover:text-foreground/80 transition-colors">
              <span>How quick is this process?</span>
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <div className="text-muted-foreground mt-4 space-y-2">
              <p>A time frame will be given upon discussing your build proposal, depending on when items are received. It's usually rather quick!</p>
              <p>You can also opt to not have your board streamed, in which case it will be completed within 2-3 business days of receiving all needed parts.</p>
            </div>
          </details>

          {/* Q3 */}
          <details className="group border border-border rounded-lg p-4 cursor-pointer">
            <summary className="flex items-center justify-between font-medium text-foreground hover:text-foreground/80 transition-colors">
              <span>Can I ship parts from vendors to you?</span>
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-muted-foreground mt-4">
              At this time, I take it on a case by case basis. I prefer if you ship the package as a single unit to avoid confusion with packages and excess duties. Let's discuss this further!
            </p>
          </details>

          {/* Q4 */}
          <details className="group border border-border rounded-lg p-4 cursor-pointer">
            <summary className="flex items-center justify-between font-medium text-foreground hover:text-foreground/80 transition-colors">
              <span>How long does the commission take?</span>
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-muted-foreground mt-4">
              A time frame will be provided based on the complexity of your build and current queue. Standard builds are typically completed within 3-4 weeks after all parts are received.
            </p>
          </details>

          {/* Q5 */}
          <details className="group border border-border rounded-lg p-4 cursor-pointer">
            <summary className="flex items-center justify-between font-medium text-foreground hover:text-foreground/80 transition-colors">
              <span>Do I get photos of my board included?</span>
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-muted-foreground mt-4">
              I typically try to take fancy photos of everything, but it's not a guarantee. Any additional media wanted by the owner needs to be discussed, so please add that in the notes!
            </p>
          </details>

          {/* Q6 */}
          <details className="group border border-border rounded-lg p-4 cursor-pointer">
            <summary className="flex items-center justify-between font-medium text-foreground hover:text-foreground/80 transition-colors">
              <span>I have more questions about a build!</span>
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-muted-foreground mt-4">
              If you're looking to inquire, please fill out the commission form below and mention your questions in the notes!
            </p>
          </details>

          {/* Q7 */}
          <details className="group border border-border rounded-lg p-4 cursor-pointer">
            <summary className="flex items-center justify-between font-medium text-foreground hover:text-foreground/80 transition-colors">
              <span>I have a prototype build I want to have you review.</span>
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-muted-foreground mt-4">
              I'm happy to review prototype builds! Shoot me an email and we can discuss your project in more detail.
            </p>
          </details>
        </div>
      </motion.div>

      {/* Commission Form */}
      <motion.div variants={fadeInUp} className="mt-16">
        <h3 className="text-2xl font-medium mb-8">Commission Request Form</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Info Section */}
            <div>
              <h4 className="text-lg font-medium mb-4 text-foreground">Personal Information</h4>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., United States" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Confirm email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="discordUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username#1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Keyboard Info Section */}
            <div>
              <h4 className="text-lg font-medium mb-4 text-foreground">Keyboard Information</h4>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="keyboardKitName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keyboard Kit Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Keychron K2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="layout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Layout</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 65%, TKL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="plateChoice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plate Choice</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Brass, Aluminum" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stabilizers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stabilizers</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., GMK, Genuine Cherry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="switches"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Switches</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Gateron Yellows, Specification details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Services Section */}
            <div>
              <h4 className="text-lg font-medium mb-4 text-foreground">Services</h4>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="switchesLubing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Switches Lubing</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="Yes + Films">Yes + Films</SelectItem>
                          <SelectItem value="Yes + Films + Springs">Yes + Films + Springs</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="providingKeycaps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Are you providing keycaps?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="returnShippingInsurance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Shipping Insurance</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Info */}
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional requirements, preferences, or questions?"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terms */}
            <FormField
              control={form.control}
              name="agreedToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    I agree to the commission terms and conditions
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Commission Request'}
            </Button>
          </form>
        </Form>
      </motion.div>
    </motion.section>
  )
}
