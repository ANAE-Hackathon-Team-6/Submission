# Submission
this repository has all the repositories of the final submission

It contains  all the apps and services for both the admin and the user side  

# Setuping of the front end : (anae-user-side)

This project is a user-side application built with **React** and **TypeScript**. It provides an interactive interface for users to interact with an AI-powered backend system. The application features a chatbot, activity proposal form, and enhanced search capabilities—all designed to deliver a seamless user experience.

## Features

- **Chatbot Interaction**  
  Users can ask questions and receive real-time responses from the backend AI system.

- **Mini and Full-Screen Chatbot**  
  - **Mini Chatbot:** A compact, toggleable widget for quick access.
  - **Full-Screen Chatbot:** An expanded view that offers a richer conversation interface.

- **Propose Activity Form**  
  Users can propose new activities via a dedicated form. The AI model processes submissions by:
  - Checking for similarity and redundancy against existing activities.
  - Notifying the user if a similar activity is found.
  - Allowing logged-in users to add the existing activity directly to their profile.

- **AI Integration in Search Activity Fields**  
  When creating a new account, users are prompted to select five activities for their profile. The search functionality leverages semantic search with word embeddings, moving beyond simple letter-by-letter lookup to interpret the meaning of user input. This results in more accurate and relevant search results.

- **Integration with Back-End**  
  All user interactions—including chatbot queries and activity proposals—communicate with a centralized API. This ensures real-time synchronization between the user interface and the administrative dashboard, with updates fetched dynamically without a full page refresh.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ANAE-Hackathon-Team-6/Submission.git
   cd Submission
  ```

2. **Install dependencies:**
  using npm:
   ```bash
   cd npm install

  or using yarn: 
  ```bash
   yarn install
  ```
3. **Running the Application**
   To run the application locally in development mode, execute:
   using npm:
   ```bash
   npm start

  or using yarn: 
  ```bash
   yarn start
  ```

5. **Production Build:**
 using npm:
   ```bash
   npm run build

  or using yarn: 
  ```bash
   yarn run build
  ```

6. **Technologies used:**
Technologies Used
React – 
TypeScript – 
# Setuping of the ai server: (anae-ai)

This guide provides steps to set up and run the Anae-AI frontend. You can either use **Docker** or install dependencies manually using `pip`.

## Prerequisites

Ensure you have the following installed on your system:

- **Docker & Docker Compose** (if using Docker)
- **Python 3.8+** and **pip** (if using manual installation)
- **Virtual environment (optional but recommended for manual installation)**

---

## Setup Instructions

### 1. create or activate a conda envirenment 

```
conda activate <your-conda-env>
```

### 2. navigate to the folder and install the requirements 

```
cd anae-ai && pip install -r requirements.txt
```
### 3. create a .env file and add your own api keys

### 4. run the server
```
python app.py
```
# Setuping of the admin server: (anae-admin-dashboard)

### 1. setup the .env file

```
cd admin-dashboard and create a .env file liek the .env.example
```

### 2. runing the servers
```
sudo docker compose up
```


### 3. runing the migrations 

```
sudo docker exec  -it django_1 sh
```
```
python manage.py migrate
```











'


  
  




