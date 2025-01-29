# Quote Manager

A comprehensive quotation management system for ChemBio Lifesciences, built with React and Flask.

## Features

- Company Management
- Employee Directory
- Client Management
- Product/Item Catalog
- Quotation Generation
- Automatic GST calculation based on HSN codes
- Company seal image upload
- PDF quotation generation

## Tech Stack

### Frontend
- React
- Material-UI
- React Router
- Modern JavaScript (ES6+)

### Backend
- Flask (Python)
- Supabase (Database)
- Python-DOCX (Document Generation)

## Setup

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8 or higher
- Supabase account

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a .env file with your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SECRET_KEY=your_secret_key
```

5. Run the server:
```bash
python app.py
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Project Structure

```
.
├── backend/
│   ├── app.py              # Main Flask application
│   ├── models/             # Database models
│   ├── uploads/            # Upload directory for images
│   └── requirements.txt    # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── App.js         # Main React application
    │   └── index.js       # Entry point
    ├── public/            # Static files
    └── package.json       # Node.js dependencies
```

## Database Schema

The application uses Supabase with the following main tables:
- companies
- employees
- clients
- items
- quotations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 