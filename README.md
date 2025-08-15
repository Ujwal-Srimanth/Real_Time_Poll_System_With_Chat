# 📊 Real Time Poll System with Chat

A live, interactive quiz and chat platform for classrooms and training sessions. Enables **real-time polling**, **live group discussions**, and **participant management**, all powered by **sockets**.

### 🔗 Live Demo: [app-realtime-poll.vercel.app](https://app-ui-deploy-dummy-y1vn.vercel.app)

---

## 🧩 Repository Structure

* **Client (Frontend)**: [`App_UI_Deploy_Dummy`](https://github.com/Ujwal-Srimanth/App_UI_Deploy_Dummy)
* **Server (Backend)**: Present in this repository

---

## 👥 Roles

### 🧑‍🏫 Teacher

* Can **create multiple-choice questions**
* Select the **correct answer** for evaluation
* Set **timer** (including custom timers)
* **Broadcast** questions to students in real-time
* View **live participant list**
* **Kick out** participants (removes access to ongoing quiz)
* Observe **live result breakdown** (correct % vs wrong %)

### 🧑‍🎓 Student

* Logs in and **waits** for the teacher to send questions
* On question emit, can **submit one answer**
* Once answered:

  * See whether it was correct
  * See **percentage of users who got it right/wrong**
* Waits for the next question to be emitted
* Can **chat** in the group chat throughout

---

## 💬 Features

* 🧠 Real-time question broadcast using **Socket.IO**
* 📈 Live statistics for each question
* 💬 Integrated **group chat**
* 🔐 Role-based login (Teacher/Student)
* ⚡ Dynamic timer with auto-submission
* 🚫 Kick participant functionality
* 🛠️ Responsive UI with **React + Redux**

---

## 🛠 Tech Stack

* **Frontend**: React, Redux, Socket.IO-client, Vercel (Deployed)
* **Backend**: Node.js, Express, Socket.IO
* **Database**: MongoDB (Mongoose)

---

## 🚀 Getting Started

### Prerequisites

* Node.js
* MongoDB

### Run Backend Locally

```bash
git clone https://github.com/Ujwal-Srimanth/Real_Time_Poll_System_With_Chat.git
cd Real_Time_Poll_System_With_Chat
npm install
npm start
```

### Run Frontend Locally

```bash
git clone https://github.com/Ujwal-Srimanth/App_UI_Deploy_Dummy.git
cd App_UI_Deploy_Dummy
npm install
npm start
```


## 🙌 Acknowledgements

Built with ❤️ by [Ujwal Srimanth](https://github.com/Ujwal-Srimanth)

---

