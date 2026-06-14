/**
 * Scribble Backend Database Engine
 * Compliant with DecodeLabs Persistence Standards
 */

const express = require('express');
const cors = require('cors');
const { sequelize, Note } = require('./database');
const { Op } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Synchronization (Builds the tables automatically)
sequelize.sync().then(() => {
    console.log('Database Schema synchronized successfully.');
}).catch(err => {
    console.error('Database Connection Error:', err);
});

// --- RESTful Routing Architecture with CRUD Operations ---

/**
 * READ (GET): Retrieve records with SQL filtering logic
 */
app.get('/api/notes', async (req, res) => {
    try {
        const { archived, tag, search } = req.query;
        let whereClause = {};

        // Boolean conditional matching
        if (archived !== undefined) {
            whereClause.archived = archived === 'true';
        }

        // Tag matching using SQL LIKE operator
        if (tag) {
            whereClause.tags = { [Op.like]: `%${tag.trim().toLowerCase()}%` };
        }

        // Global search across multiple columns
        if (search) {
            const query = search.toLowerCase().trim();
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${query}%` } },
                { content: { [Op.like]: `%${query}%` } },
                { tags: { [Op.like]: `%${query}%` } }
            ];
        }

        // Execute ORM Query
        const notes = await Note.findAll({ 
            where: whereClause, 
            order: [['createdAt', 'DESC']] 
        });

        // Format data back to frontend-expected JSON arrays
        const formattedNotes = notes.map(note => ({
            ...note.toJSON(),
            tags: note.tags ? note.tags.split(',') : []
        }));

        res.status(200).json(formattedNotes);
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not retrieve data." });
    }
});

/**
 * CREATE (POST): Validate and store a new record
 */
app.post('/api/notes', async (req, res) => {
    try {
        const { title, tags, content } = req.body;
        
        // Pillar 4: The Shield - Data Validation
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: "Validation Failure: Title is required." });
        }

        const newNote = await Note.create({
            title: title.trim(),
            tags: Array.isArray(tags) ? tags.map(t => t.trim().toLowerCase()).join(',') : '',
            content: content || '',
            archived: false
        });

        const formattedNote = { ...newNote.toJSON(), tags: newNote.tags ? newNote.tags.split(',') : [] };
        res.status(201).json(formattedNote);
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not create resource." });
    }
});

/**
 * UPDATE (PUT): Completely replace a record's data payload
 */
app.put('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, tags, content } = req.body;

        if (!title || title.trim() === '') {
            return res.status(400).json({ error: "Validation Failure: Title cannot be blank." });
        }

        const note = await Note.findByPk(id);
        if (!note) return res.status(404).json({ error: "Resource Exception: Note ID not found." });

        // Update properties and execute SQL save
        note.title = title.trim();
        note.tags = Array.isArray(tags) ? tags.map(t => t.trim().toLowerCase()).join(',') : '';
        note.content = content || '';
        await note.save();

        const formattedNote = { ...note.toJSON(), tags: note.tags ? note.tags.split(',') : [] };
        res.status(200).json(formattedNote);
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not update resource." });
    }
});

/**
 * UPDATE (PATCH): Safely modify a specific column (Archival Status)
 */
app.patch('/api/notes/:id/archive', async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findByPk(id);
        
        if (!note) return res.status(404).json({ error: "Resource Exception: Note ID not found." });

        note.archived = !note.archived;
        await note.save();

        const formattedNote = { ...note.toJSON(), tags: note.tags ? note.tags.split(',') : [] };
        res.status(200).json(formattedNote);
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not modify resource." });
    }
});

/**
 * DELETE (DELETE): Permanently remove data from SQL storage
 */
app.delete('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await Note.destroy({ where: { id } });
        
        if (!deletedRows) {
            return res.status(404).json({ error: "Resource Exception: Note ID not found." });
        }
        
        res.status(200).json({ message: "Resource successfully deleted from permanent storage." });
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not delete resource." });
    }
});

// --- Start Engine ---
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Scribble Database Engine Online: Port ${PORT}`);
    console.log(` Persistence Model: SQLite + Sequelize ORM`);
    console.log(`====================================================`);
});