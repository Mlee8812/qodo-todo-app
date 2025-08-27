# Testing Report – Qodo To-Do App

## Repository
[https://github.com/Mlee8812/qodo-todo-app](https://github.com/Mlee8812/qodo-todo-app)

---

## Environment
- **OS Tested:** Windows 11, macOS  
- **Node.js:** v20.x  
- **Browser:** Chrome 127  
- **Editor:** VS Code with Qodo Gen Agent installed  

---

## What Was Tested
- ✅ Verified the app loads and renders without errors  
- ✅ Added tasks, marked tasks as complete, and deleted tasks  
- ✅ Interacted with UI buttons to confirm state updates correctly  
- ✅ Tested persistence after refresh (localStorage)  
- ✅ Explored Qodo Gen Agent features including *Explain this Code* and *Agentic Mode*  

---

## Observations
- Core functionality (add, toggle, delete) worked as expected  
- The UI responded smoothly to user interactions  
- Qodo Gen Agent generally responded correctly during testing  

---

## Issues Encountered
1. **Processing speed** – Commands and prompts occasionally took longer than expected  
2. **Explain This Code** – Did not consistently return explanations on Windows; worked when tested on macOS (possible environment-specific issue)  
3. **Agentic Mode navigation** – Could not navigate back to chat history; required restarting VS Code as a workaround  

---

## Screenshots
📂 Screenshots demonstrating the app’s functionality are located in the `screenshots/` folder of this repository.  

---

## Summary
The core to-do app features are functional and stable. Minor issues were observed with Qodo Gen Agent features, particularly around performance and navigation, but these did not block main functionality.  
