-- Schema PostgreSQL pour GSB Pharmacy
-- Créé le : 2025-06-18

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    siret VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(5) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_image VARCHAR(255)
);

-- Table des médicaments
CREATE TABLE IF NOT EXISTS medicaments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_name VARCHAR(255) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_message TEXT
);

-- Table des éléments de commande
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    medicament_id INTEGER NOT NULL REFERENCES medicaments(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer les données de test utilisateurs
INSERT INTO users (name, siret, email, password, role, phone, address, city, postal_code) VALUES
('Pharmacie Test', '12345678901234', 'test@test.com', '$2a$10$TsKJ4ptpN0VTWQyaTsLw..vP9oPMMpaAN0FmwVStNC7WSD7EJj87e', 'user', '0612345678', '123 rue Test', 'Paris', '75000'),
('GSB Admin', '98765432101234', 'admin@gsb-pharma.fr', '$2a$10$TsKJ4ptpN0VTWQyaTsLw..vP9oPMMpaAN0FmwVStNC7WSD7EJj87e', 'admin', '0123456789', '15 rue de l''Administration', 'Paris', '75001')
ON CONFLICT (email) DO NOTHING;

-- Insérer les données de test médicaments
INSERT INTO medicaments (name, description, price, stock, image_url) VALUES
('Paracétamol', 'Antalgique et antipyrétique', 5.99, 100, '/images/paracetamol.jpg'),
('Ibuprofène', 'Anti-inflammatoire non stéroïdien', 7.99, 80, '/images/ibuprofene.jpg'),
('Aspirine', 'Antalgique et anti-inflammatoire', 6.99, 90, '/images/aspirine.jpg'),
('Doliprane', 'Antalgique et antipyrétique', 5.99, 150, '/images/doliprane.jpg'),
('Efferalgan', 'Antalgique et antipyrétique', 6.99, 120, '/images/efferalgan.jpg')
ON CONFLICT (name) DO NOTHING; 