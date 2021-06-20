const {Schema, model, Types} = require('mongoose')

const UserSchema = new Schema({
    email: {type: String, required: true, uniqie: true},
    password: {type: String, required: true},
    notes: {type: Types.ObjectId, ref: 'News'}
})

module.exports =  model('User', UserSchema)