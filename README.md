# 🍽️ Menu Advisor (Client)

**Menu Advisor** is a small demo project that showcases the Menu Advisor model in action. It provides a simple interface to help restaurants suggest the best dishes to customers based on their preferences and dietary restrictions. It connects to an AI model backend to generate dynamic questions and suggest dishes in real time

👉 Powered by the [Menu Advisor Model](https://github.com/pacchio/menu-advisor-model)

---

### 🚀 How to Start Locally

#### 1. **Clone the repository**

```bash
   git clone https://github.com/your-username/menu-advisor-client.git
   cd menu-advisor-client
 ```

#### 2. **Install dependencies**

```bash
   yarn install
 ```

#### 3. **Set environment variables**

Create a .env.local file and add your backend base URL:

```bash
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
 ```

#### 4. Run the development server
```bash
   yarn dev
 ```

Open your browser at http://localhost:3000 to start using the app.

### 🧠 Backend Model

This project communicates with an AWS Lambda through an API Gateway.

You can find the backend project here:
👉 [Menu Advisor Model Repository](https://github.com/pacchio/menu-advisor-model)

### 🎬 Demo

Check out a quick video of how it works in action:

<video controls width="600">
  <source src="./demo.mov" type="video/mp4">
  Your browser does not support the video tag.
</video>
