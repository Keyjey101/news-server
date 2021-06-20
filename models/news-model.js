const {Schema, model, Types} = require('mongoose')

const NewsSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},    
    user: {type: Types.ObjectId, ref: 'User'}
})

module.exports =  model('News', NewsSchema)