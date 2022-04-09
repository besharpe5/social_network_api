const { Thought, User } = require('../models');

const thoughtController = {
    // this will GET all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({
            path: 'reactions', 
            select: '-__v'
        })
        .select('-__v')
        .sort({
            _id: -1
        })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // this will GET a single thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({
            _id: params.id
        })
        .populate({
            path: 'reactions', 
            select: '-__v'
        })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    // this will create a thought
    createThought({ params, body}, res) {
        Thought.create(body)
        .then(({_id }) => {
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $push: { thoughts: _id} },
                { new: true }
            );
    })
    .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'We are unable to find a thought with this id. Try again!' });
            return;
        }
        res.json(dbThoughtData);
    })
    .catch(err => res.json(err));
    },

    // this will update a thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
        .populate(
            {
                path: 'reactions', 
                select: '-__v'
            }
        )
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'We are unable to find a thought with this id. Try again!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    // this will DELETE a thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({_id: params.id})
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'We are unable to find a thought with this id. Try again!' });
                return;
            }
            res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },

    // this will add a reaction
    addNewReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            {_id: params.thoughtId}, 
            {$push: {reactions: body}}, 
            {new: true, runValidators: true})
        .populate(
            {
                path: 'reactions', 
                select: '-__v'
            }
        )
        .select('-__v')
        .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'We are unable to find a thought with this id. Try again!' });
            return;
        }
        res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err))
    },

    // this will remove a reaction
    removeReaction({params}, res) {
        Thought.findOneAndUpdate(
            {_id: params.thoughtId}, 
            {$pull: {reactions: {reactionId: params.reactionId}}}, 
            {new : true})
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'We are unable to find a thought with this id. Try again!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    }
}

module.exports = thoughtController;