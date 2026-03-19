<div align="center">
  <a href="https://github.com/boreashe/yasc">
    <img src="public/favicon.svg" alt="Logo" width="100" height="100">
  </a>

  <h3 align="center">YASC</h3>

  <p align="center">
    Yet Another Score Calculator | or as the app insists, YASC Ain't Score Calculator
    <br />
  </p>
  <hr/>
  <br/>

![AGPL V2](https://img.shields.io/badge/license-AGPL_v3-brightgreen?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![YAML](https://img.shields.io/badge/yaml-%23ffffff.svg?style=for-the-badge&logo=yaml&logoColor=151515)
<br/>

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Shadcn/ui](https://img.shields.io/badge/shadcn/ui-%23000000?style=for-the-badge&logo=shadcnui&logoColor=white)

\>\> [🔗 **Live Demo on my GitHub Page**](https://boreashe.github.io/yasc) <<

</div>

YASC is a clean and offline-first web app designed for computing scores in any kind of point-based system. It provides an interactive feedback experience driven by a declarative rule engine.

Currently, it only has one ruleset for calculating your CRS (Comprehensive Ranking System) score, original built since the author was not satisfied with the UX of the [official tools](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/check-score.html) and existing third-party options.

<details>
  <summary><b><i>What is CRS?</i></b></summary>
  The Comprehensive Ranking System is the points-based framework used by IRCC in Canada to rank candidates in the Express Entry immigration pool. Your CRS score determines your chances of receiving an Invitation to Apply (ITA) for Canadian permanent residence. YASC currently ships with one built-in ruleset covering the standard CRS profile score, though the engine is built to go beyond that over time.
</details>
<br/>

> Disclaimer: YASC is an independent project with no affiliation with and not endorsed by **Immigration, Refugees and Citizenship Canada (IRCC)**. Scores calculated here are solely for personal reference.

## Features (as of v1.0)

- 🎨 **Handcrafted UI** with light and dark themes, with separate layouts designed specifically for both desktop and mobile.
- 📊 **Live scoring breakdown**: on desktop, the input form sits on the left and a scoring table on the right updates in real time as you fill in your profile. On mobile, a bottom bar shows your running total and expands into the full scoring table as a sheet.
- 🖱️ **Button-first inputs**: every question in the form uses simple clickable buttons, keeping interaction fast and clean.
- 🔍 **Hover-to-highlight** (desktop): hovering a criterion in the scoring table highlights the form questions that feed into it, so the relationship between inputs and points is always clear.
- ✈️ **Fully offline**: no download is required, nothing leaves your browser, no account required. Can be installed as a PWA if you prefer.
- ⚙️ **YAML rule engine**: all scoring logic lives in a declarative ruleset file, keeping the engine reusable across different scoring systems.

## Getting Started (for developers)

_Note: Normal users can access a working app on [my GitHub Page](https://boreashe.github.io/yasc)._

**Prerequisites:** Node.js and npm.

```bash
git clone https://github.com/boreashe/yasc.git
cd yasc
npm i
npm run dev
```

If you have [Vite+](https://github.com/voidzero-dev/vite-plus) on your machine, you can also use the Vite+ CLI directly:

```bash
vp dev
```

or via the npm script alias:

```bash
npm run vp:dev
```

> Vite+ (VitePlus) is an optional unified toolchain by VoidZero. YASC's `package.json` has been adjusted so that a global Vite+ installation is not a hard requirement for running or forking the project.

## The Rule Engine _(for power users)_

YASC's scoring logic is fully data-driven. The engine processes two files per scoring system:

- 📄 A **ruleset YAML** describing the scoring system
- 🌐 A **localization YAML** for that ruleset

Each ruleset moves through four stages in sequence.

### 1. Metadata

A short header declaring the ruleset's identity and version. The engine uses this to manage ruleset loading and (eventually) switching.

```yaml
meta:
  id: "canada-crs"
  version: v2025.03.25
```

### 2. Form

Defines every question the user sees. Each question has a `key`, a `type`, and a list of `values` that become the clickable buttons in the UI. Two features keep the form definition compact:

- `prerequisites` makes a question visible only when a parent question matches a specific value, so the full tree of language sub-questions only appears after the user picks their test type.
- `use` lets a question reuse the `values` list from another question entirely, avoiding repetition when multiple questions share the same option set.

```yaml
# A top-level question
- key: english
  type: value
  values:
    - "no"
    - "CELPIP-G"
    - "IELTS"
    - "PTE Core"

# Only visible when english == "CELPIP-G".
# Reuses the options defined on english_celpip_speaking_score.
- key: english_celpip_listening_score
  type: value
  prerequisites:
    english: "CELPIP-G"
  use: "english_celpip_speaking_score"
```

### 3. Preprocess

Transforms raw form values into intermediate variables that the scoring stage can work with. This is where test-specific scores get normalised into a common scale (e.g. CLB for English, NCLC for French), minimums are computed across the four language skills, and the engine determines which language ranks as the primary and which as the secondary.

Three operations are currently supported: `map_values` for lookup-based translation, `min`/`max` for reducing a set of variables to a single value, and `conditional_assignment` for if/else branching.

```yaml
# Translate a raw CELPIP score to a CLB level
- key: english_celpip_speaking_clb_translation
  operation: map_values
  config:
    sources: ["english_celpip_speaking_score"]
    outputs: ["english_speaking_clb"]
    mapping:
      "10-12": "10"
      "9": "9"
      "4": "4"
      "M, 0-3": "0"

# Find the weakest of the four English skill scores
- key: lowest_english_score
  operation: min
  config:
    sources:
      - "english_speaking_clb"
      - "english_listening_clb"
      - "english_reading_clb"
      - "english_writing_clb"
    output: "english_lowest_clb"
    fallback: "0"

# Assign primary and secondary language based on which overall score is higher
- key: primary_secondary_official_languages
  operation: conditional_assignment
  config:
    if:
      operation: gte
      left: "english_lowest_clb"
      right: "french_lowest_nclc"
    then:
      - source: "english_lowest_clb"
        output: "first_official_language_lowest"
      # ...
    else:
      - source: "french_lowest_nclc"
        output: "first_official_language_lowest"
      # ...
```

### 4. Eval

Calculates the final score. Rules are organized as a tree of named `sub`-keys, each containing a list of `clauses`. A clause matches when all its conditions are satisfied and contributes its `score` value. Categories can carry a `max` cap, and sub-scores marked `aggregate: true` are summed across their children.

A `template` directive handles cases where the same scoring logic applies to multiple variables (e.g. speaking, listening, reading, writing). It expands into one clause set per substitution at evaluation time, which keeps the ruleset from becoming four times as long as it needs to be.

```yaml
- key: first_official_language
  aggregate: true
  sub:
    - key: first_official_language_aspect
      template:
        find: "first_official_language_aspect"
        replace: "aspect"
        with: ["speaking", "writing", "reading", "listening"]
      clauses:
        - if:
            first_official_language_aspect: "10"
            with_spouse: "no"
          score: 34
        - if:
            first_official_language_aspect: "10"
            with_spouse: "yes"
          score: 32
        # ...

# Skill transferability caps the whole category and each sub-group independently
- key: skill_transferability_factors
  max: 100
  sub:
    - key: education
      max: 50
      sub:
        - key: education.language_proficiency
          clauses:
            - if:
                education: ["multiple_degrees", "master_or_professional_degree", "doctor"]
                first_official_language_lowest: ["9", "10"]
              score: 50
            # ...
```

The current CRS ruleset at `src/assets/rules/canada-crs.yaml` is a useful real-world reference, though it may sit at the complex end of what the engine handles. CRS involves a lot of arbitrary two-dimensional scoring tables and non-linear point scales, which is part of why the file is as long as it is. A formal syntax guide is planned once the format stabilizes.

## Roadmap

A few things in my thought, in no particular order:

- 📡 **CRS draw history**: pull recent draw data from a community-maintained open source API and let users benchmark their score against historical cutoffs. This would make the app not entirely offline by definition (still it won't submit any of your data), but only as an opt-in feature.
- ⚠️ **Ruleset-driven alerts**: surface warnings when a profile has a logical issue, such as missing language scores that Express Entry requires. The rule engine currently has no mechanism for conditional validation of this kind.
- 💡 **What-If analysis**: a fifth pipeline stage that suggests concrete steps to raise your score based on your current profile. Rule-based, no AI involved.
- 📱 **Better mobile interactivity**: bring UX features like the scoring table highlight to mobile users, which currently only work on desktop.
- 📂 **Ruleset I/O**: allow users to upload and switch between rulesets directly in the UI.
- 🏛️ **Ruleset library**: accept community-submitted rulesets via PR, with the possibility of bundling well-tested ones into the main repo.
- 🧪 **Testing**: add test cases.

## Contributing

**Issues are very welcome.** Bug reports, questions, and feature suggestions are all fair game.

Pull requests are not expected at this stage. If you have something in mind, opening an issue first is the best way to start a conversation.

## Contact

Discord: boreashe

## License

YASC is released under the [GNU Affero General Public License v3.0](./LICENSE.md).
