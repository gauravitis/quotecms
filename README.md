# ChemBio Lifesciences - Quote Management System

![ChemBio Lifesciences](https://img.shields.io/badge/ChemBio-Lifesciences-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

A modern, full-stack web application for managing quotations and internal operations at ChemBio Lifesciences. This system provides a streamlined approach to creating, managing, and tracking quotations with a beautiful, responsive user interface.

## 🚀 Features

- **Modern Landing Page**
  - Professional animations and transitions
  - Secure access warning
  - Responsive design

- **Dashboard**
  - Company management
  - Employee directory
  - Quotation system

- **Quotation System**
  - Create and manage quotations
  - Dynamic item management
  - Automatic PDF generation
  - Reference number tracking

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Emotion** - Styling
- **Axios** - API requests

### Backend
- **Python Flask** - Web framework
- **Supabase** - Database and authentication
- **python-docx** - Document generation
- **Flask-CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **Git** - Version control
- **npm** - Package management
- **pip** - Python package management

## 🏗️ Architecture

The application follows a modern client-server architecture:

```
frontend/                 # React frontend application
├── src/
│   ├── components/      # React components
│   ├── api/            # API integration
│   └── assets/         # Static assets
│
backend/                 # Flask backend application
├── app.py              # Main application file
├── models/             # Data models
└── templates/          # Document templates
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- npm or yarn
- pip

### Installation

1. Clone the repository
```bash
git clone https://github.com/gauravitis/quotecms.git
cd quotecms
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd backend
pip install -r requirements.txt
```

4. Set up environment variables
```bash
# Create .env file in backend directory
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SECRET_KEY=your_secret_key
```

5. Run the application
```bash
# Terminal 1 - Frontend
cd frontend
npm start

# Terminal 2 - Backend
cd backend
python app.py
```

## 👨‍💻 About the Author

### Gaurav Singh
A passionate full-stack developer with expertise in building modern web applications. With a strong foundation in both frontend and backend technologies, I specialize in creating efficient, scalable, and user-friendly solutions.

#### Skills
- Frontend Development (React.js, Vue.js)
- Backend Development (Python, Node.js)
- Database Design (PostgreSQL, MongoDB)
- Cloud Services (AWS, GCP)
- DevOps & CI/CD

#### Connect with Me
- [GitHub](https://github.com/gauravitis)
- [LinkedIn](https://linkedin.com/in/gauravitis)
- [Portfolio](https://gauravitis.dev)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 