# Talous — Brand & Landing Concept

**Status:** v0.1 · concept + moodboard (no full page yet)
**Date:** 17 Jun 2026
**Branch:** `claude/talous-landing-redesign-q75u96`

> Companion artifact: open `moodboard.html` in a browser for the visual + motion version.

---

## 0. The one line

**Make the visitor feel deeply understood before they feel impressed.**
Speak her exact language, name her real problems, earn trust — *then* show the craft.
Warm, human, down-to-earth. Awwwards-level execution, but it should feel like a letter from
someone who gets it, not a SaaS dashboard.

---

## 1. Who we are actually talking to

Not "SMEs." One person:

> **Aisyah, 34** — founder of a skincare brand in Shah Alam. ~RM18,000/month on Meta ads.
> Was paying an agency RM9,000/month; quietly suspects half of it is wasted. Still does ad
> tweaks herself at 11pm because she doesn't fully trust anyone with it. Gets a monthly report
> full of "CTR" and "ROAS," nods, pays the invoice — and still doesn't know if it worked.

Her emotional state: **anxious, a little ashamed she doesn't "get" digital, and tired.**
She does not want to learn what MCP is. She does not want another dashboard. She wants three
things: to feel her money is working, to get her evenings back, and to trust someone.

What she is **not**: an AI-savvy agency operator. We are explicitly *not* selling to people who
can build this themselves (Roadmap v3, the pivot). We are the AI agency she hires.

---

## 2. The positioning

Talous replaces the RM8k–RM20k/month agency with an AI that costs a fraction, runs 24/7, and —
critically — **shows its work**. Trust is the entire game, because she's handing a stranger her
ad budget. So transparency *is* the product story: every decision carries a plain-language
reason and a confidence score, with a full audit trail.

The name **Talous** (Finnish: *household economy / finances*) is kept, with a **fresh wordmark**.
We can lean on that meaning: *the health of your business's economy, handled.*

---

## 3. Messaging architecture — the page as a 6-beat ledger

The page is a narrative, not a feature list. Each beat earns the next.

1. **Mirror** — open by describing her exact situation, in her words. No product yet.
   *"You're spending RM18,000 a month on ads. Be honest — do you actually know if it's working?"*
2. **Name the real problem** — the agency black-box / the 11pm DIY loop.
   *"Your agency sends a report full of CTR and ROAS. You nod. You pay. You still don't know."*
3. **The turn** — meet Talous. Not software you operate; an AI that runs your ads like the best
   agency would, and tells you what it did in plain language.
4. **Prove it** — the monthly value report + the audit trail. Real numbers. Every decision has a
   reason and a confidence score. *"We don't ask you to trust us. We show you."*
5. **De-risk** — honest pricing next to the agency (RM799 vs RM9k), no lock-in, you choose
   approve-each-change or full auto-pilot, updates on WhatsApp.
6. **Invite** — a soft, human CTA: a free ad teardown. *"Let's look at your ads together — free."*

---

## 4. Voice & tone

- Second person, plain-spoken, warm. Short sentences. Concrete numbers.
- Malaysian by default: Ringgit, WhatsApp, local cadence — comfortable, never forced.
- Honest that it's AI. The transparency *is* the trust.
- No jargon unless we translate it in the same breath.

**Jargon → plain (a recurring on-page device):**
- ROAS 2.5× → *"For every RM1 you spend, you get RM2.50 back."*
- CTR → *"How many people actually clicked."*
- CPA → *"What it costs to win one customer."*

**Do:** "You tried doing it yourself. It ate your weekends." ·
**Don't:** "Leverage our AI-powered growth engine to optimize omnichannel performance."

---

## 5. Naming & wordmark direction

Keep **Talous**, design a new wordmark. Three explorations (rendered in `moodboard.html`):

- **A · The Loop** *(recommended)* — the `ou` becomes a continuous loop: the flywheel from the
  product thesis (*acquisition feeds retention; retention funds acquisition*). Ownable, ties the
  name's meaning to the product.
- **B · The Ledger** — lowercase `talous` set in a warm serif over a fine baseline rule; quiet,
  trustworthy, "the honest books."
- **C · The Sprout** — humanist sans with a small upward tick / leaf: money that grows.

Symbol options: a coin-with-a-sprout, a loop, or a "T" that reads as a household roof.

---

## 6. Visual system

**Warmth is the differentiator** (the current site is dark neon-techy; this is the opposite).

**Palette — Warm Daylight (spine):**
- Paper `#F6F1E7`, deeper card `#EFE8DA`
- Ink (espresso, not pure black) `#211C16`, soft ink `#5C5347`
- Money green `#1F6B47` / bright `#2E8B5E`
- Honey/clay `#D98E3C` / `#B5613A`

**Palette — Warm Dusk (for hero + product-demo moments):**
- Warm charcoal `#1B1714` / `#241E19`, cream `#F2EADC`, green `#46B985`, honey `#F0B45F`

**Type:**
- **Fraunces** — display/headlines. Warm, soft, characterful serif. The "human" voice.
- **Hanken Grotesk** — body/UI. Friendly humanist sans.
- **JetBrains Mono** — numbers, labels, the audit/receipt texture. The "proof" voice.

**Texture / motif:** the honest ledger — subtle paper grain, fine rules, hand-circled numbers,
margin annotations. The flywheel as a quiet recurring loop, rendered warm not techy.

**Art direction (photography):** warm, candid, golden-hour photos of *real* SEA business owners
in their element (packing skincare orders, the clinic front desk, the kopitiam) with gentle film
grain. Never stock-corporate, never blue-tinted "tech."

---

## 7. Motion signature (warm, weighty — not flashy)

- **Numbers that breathe** — value figures count up gently and settle.
- **Jargon translation** — hover a term like *ROAS* and it warmly rewrites itself into plain words.
- **The slow flywheel** — scroll-linked, money/leads flow through the loop.
- Heavy, slow easing; organic motion. The opposite of the current snappy neon site.

---

## 8. Product-demo video (Remotion) — storyboard

A ~40s warm product *film*, not a feature reel. No `remotion` skill is registered in this
session, so I'd scaffold Remotion directly (React/TS compositions → MP4).

1. **Cold open** — warm dark, mono clock `23:47`, Aisyah's face lit by a laptop. *"This was Aisyah every night."*
2. **The problem** — an agency report of jargon; a RM9,000 invoice.
3. **The turn** — the Talous command deck wakes. *"While she slept, Talous worked."*
4. **Show the work** — audit trail: paused 3 weak ads, scaled 2 winners — each with a reason + confidence.
5. **The value report** — *"+RM81,000 this month. 15 hours back."*
6. **Close** — Aisyah at dinner, phone face-down. Wordmark + *"Talous. Marketing that proves itself."*

---

## 9. Tagline candidates

- Your ads, finally working.
- The agency that shows its work.
- Know where every ringgit goes.
- Marketing that proves itself.
- An AI that spends your ad budget like it's its own.

---

## 10. What's next (after you react to the moodboard)

1. Lock palette + wordmark direction.
2. (Optional) generate real wordmark vectors via Canva MCP.
3. Build the hero + design-system in code (warm tokens, Fraunces/Hanken/JetBrains).
4. Build the full single-page landing along the 6-beat arc.
5. Scaffold the Remotion demo and embed it.
