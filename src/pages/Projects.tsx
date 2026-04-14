import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, TrendingUp, Users, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

export default function Projects() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOpen(false);
      toast.success("Campaign Created!", {
        description: "Your campaign has been submitted for review and will be live shortly.",
      });
    }, 1500);
  };

  const CreateCampaignDialog = ({ children }: { children: React.ReactNode }) => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">Create Campaign</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Define your goals, target audience, and budget to launch on Base.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-bold">Campaign Title</Label>
              <Input id="title" placeholder="e.g., Summer NFT Mint" required className="bg-muted/50 border-border" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal" className="font-bold">Primary Goal</Label>
                <Select required defaultValue="mint">
                  <SelectTrigger className="bg-muted/50 border-border">
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mint">NFT Mint</SelectItem>
                    <SelectItem value="swap">Token Swap</SelectItem>
                    <SelectItem value="growth">User Growth (Referrals)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget" className="font-bold">Budget (USDC)</Label>
                <Input id="budget" type="number" min="100" placeholder="500" required className="bg-muted/50 border-border" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetPOI" className="font-bold">Target Audience (Min POI Score)</Label>
              <Select required defaultValue="50">
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue placeholder="Select minimum score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All Users (0+)</SelectItem>
                  <SelectItem value="50">Verified Users (50+)</SelectItem>
                  <SelectItem value="75">High Impact (75+)</SelectItem>
                  <SelectItem value="90">Top 10% Alpha (90+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-bold">Description & Requirements</Label>
              <Textarea 
                id="description" 
                placeholder="Describe what users need to do to earn the reward..." 
                required 
                className="bg-muted/50 border-border min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full font-bold bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isSubmitting ? "Creating..." : "Launch Campaign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="border-primary/50 text-primary px-4 py-1 rounded-full mb-4">
            FOR BASE PROJECTS
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
            GET REAL USERS ON BASE <br />
            <span className="text-primary">WHO ACTUALLY MINT & SWAP</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
            Not bots. Not fake engagement. Real onchain impact driven by the most influential users in the ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <CreateCampaignDialog>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8 rounded-2xl text-lg">
                Launch Campaign
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CreateCampaignDialog>
            <Button size="lg" variant="outline" className="border-border hover:bg-white/5 font-bold h-14 px-8 rounded-2xl text-lg">
              View Case Studies
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Takes less than 2 minutes to set up.</p>
        </motion.div>
      </section>

      {/* Proof Section */}
      <section className="py-16 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-2">
            <p className="text-4xl font-black text-primary">120+</p>
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Users Reached</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl font-black text-primary">35%</p>
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Avg Mint Rate</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl font-black text-primary">$0.60</p>
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Avg CPA</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black tracking-tighter">HOW IT WORKS</h2>
          <p className="text-muted-foreground">Three steps to high-quality distribution.</p>
        </div>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Create Campaign",
              desc: "Define your goal (Mint, Swap, Growth) and set your budget in USDC.",
              icon: Target
            },
            {
              step: "02",
              title: "Target Quality",
              desc: "Our engine targets users with high POI scores who match your project's vibe.",
              icon: Zap
            },
            {
              step: "03",
              title: "Get Results",
              desc: "Watch real-time onchain actions as users complete your requirements.",
              icon: TrendingUp
            }
          ].map((item, i) => (
            <Card key={i} className="bg-card border-border p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-4xl font-black text-primary/20">{item.step}</span>
                <item.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Case Study Section */}
      <section className="py-20 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto rounded-3xl border border-primary/20 p-8 md:p-12 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">CASE STUDY</Badge>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-black tracking-tighter">PROJECT X: NFT MINT PUSH</h2>
            <p className="text-muted-foreground">How a new Base NFT collection sold out their whitelist in 48 hours.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Goal", value: "NFT Mint" },
              { label: "Users", value: "120" },
              { label: "Mints", value: "35" },
              { label: "CPA", value: "$0.60" }
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{stat.label}</p>
                <p className="text-xl font-black text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-sm italic text-muted-foreground">
              "POI brought us the exact type of users we were looking for. Not just farmers, but actual collectors who are active on Base and Farcaster."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div>
                <p className="text-sm font-bold">Founder, Project X</p>
                <p className="text-xs text-muted-foreground">Base Ecosystem Project</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center space-y-8">
        <h2 className="text-4xl font-black tracking-tighter">READY TO GROW ON BASE?</h2>
        <CreateCampaignDialog>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-16 px-12 rounded-2xl text-xl">
            Launch Your First Campaign
          </Button>
        </CreateCampaignDialog>
        <p className="text-muted-foreground">Join 10+ projects already scaling with POI.</p>
      </section>
    </div>
  );
}
