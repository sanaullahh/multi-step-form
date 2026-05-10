# Multi-Step Form

A smooth, fully validated 4-step form built with vanilla HTML, CSS, and JavaScript — submitted as **Task 4 (Intermediate)** of the Nexe-Agent Frontend Developer Internship.

## 🔗 Live Demo
https://ubiquitous-phoenix-a66a23.netlify.app/

## ✦ Features

### 🧭 Step Navigation
- 4 steps: Personal Info → Account Setup → Preferences → Review
- Animated slide-in and slide-out between steps
- Sidebar shows active, completed ✓ and upcoming steps
- Progress bar fills as you move forward
- Dot indicators animate at the bottom
- Back button to return to previous step

### ✅ Validation (per step)
- Step 1 — First name, last name, valid email format, phone number
- Step 2 — Username format (3–20 chars), password min 8 chars, passwords must match
- Step 3 — Must select a plan, must pick at least one interest
- Step 4 — Must agree to Terms of Service
- Invalid fields shake and turn red with error messages
- Password strength meter (Weak → Fair → Good → Strong)
- Show/hide password toggle

### 💾 localStorage (Auto-Save)
- Every keystroke saves progress automatically
- Refresh the page — your data is still there
- Passwords are NOT saved for security
- Progress cleared automatically after successful submit
- "Progress auto-saved" indicator in the sidebar

### 📋 Review Step
- Shows all entered data before final submit
- Edit buttons jump back to any specific step
- Terms of Service and marketing checkboxes

### 🎉 Success Screen
- Confirmation screen after submit
- Summary of submitted details
- Start Over button clears everything

## 🛠 Built With
- HTML5
- CSS3 (Animations, Transitions, CSS Variables, Flexbox, Grid)
- Vanilla JavaScript
- Web Storage API (localStorage)

## 📁 File Structure
