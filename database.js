const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Pillar 2: The Bridge - Initialize SQLite Database using Sequelize ORM
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(dataDir, 'scribble.sqlite'),
    logging: false // Disabled for a clean terminal output
});

// Pillar 1: The Blueprint - Define the Database Schema
const Note = sequelize.define('Note', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true // The unique identifier for every row 
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    tags: {
        type: DataTypes.STRING, // Stored as a comma-separated string for SQLite simplicity
        defaultValue: ""
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = { sequelize, Note };