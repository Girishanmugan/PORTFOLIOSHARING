const express = require('express');
const Portfolio = require('../models/Portfolio');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Create Portfolio (protected)
router.post('/create', authenticate, async (req, res) => {
    const { title, description, link, technologies } = req.body;
    
    try {
        const portfolio = new Portfolio({
            title,
            description,
            link,
            technologies: technologies || [],
            userId: req.user.userId
        });
        
        await portfolio.save();
        res.status(201).json({
            message: 'Portfolio created successfully',
            portfolio
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all portfolios (public)
router.get('/all', async (req, res) => {
    try {
        const portfolios = await Portfolio.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(portfolios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user's portfolios (protected)
router.get('/my-portfolios', authenticate, async (req, res) => {
    try {
        const portfolios = await Portfolio.find({ userId: req.user.userId })
            .sort({ createdAt: -1 });
        res.json(portfolios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single portfolio by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id)
            .populate('userId', 'name email');
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }
        res.json(portfolio);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Portfolio (protected - owner only)
router.put('/:id', authenticate, async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);
        
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }
        
        if (portfolio.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Not authorized to update this portfolio' });
        }
        
        const { title, description, link, technologies } = req.body;
        portfolio.title = title || portfolio.title;
        portfolio.description = description || portfolio.description;
        portfolio.link = link || portfolio.link;
        portfolio.technologies = technologies || portfolio.technologies;
        
        await portfolio.save();
        res.json({
            message: 'Portfolio updated successfully',
            portfolio
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Portfolio (protected - owner only)
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);
        
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }
        
        if (portfolio.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Not authorized to delete this portfolio' });
        }
        
        await Portfolio.findByIdAndDelete(req.params.id);
        res.json({ message: 'Portfolio deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
