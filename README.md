# 🧠 MindTracing Insights

> Your AI-powered mental health journaling companion — built with open-source LLMs to analyze emotions, detect thought patterns, and suggest personalized affirmations & prompts.
---

## ✨ Inspiration

Mental health journaling is a powerful tool — but many people struggle to reflect deeply or recognize patterns in their thoughts. We wanted to build an AI companion that doesn't just listen, but helps users understand and improve their emotional well-being over time.

---

## 💡 What It Does

MindTracing allows users to write daily journal entries. It uses an open-source LLM to:

- 🧠 Detect and summarize emotional tone
- 🔁 Analyze recurring thought patterns (like stress or self-doubt)
- 🌱 Suggest a personalized CBT-based affirmation
- 📝 Provide a reflective journaling prompt for tomorrow
- 📊 Track mood trends over time (coming soon!)

---

## 🛠️ How We Built It

- **LLM:** [Zephyr-7B (HuggingFace)](https://huggingface.co/HuggingFaceH4/zephyr-7b-beta) – powerful open-source model for emotional analysis
- **Framework:** Streamlit – lightweight and fast UI
- **Logic:** Prompt engineering with multiple chained tasks per journal
- **Storage:** Local session or JSON file (SQLite optional)
- **Visualization:** Matplotlib / Plotly for mood trends

---

## 🧩 Prompt Flow (LLM Chain)

```text
1. Analyze tone and emotion from journal text
2. Detect recurring negative/positive themes across entries
3. Generate a short affirmation using CBT techniques
4. Suggest a journaling prompt to reflect deeper tomorrow
