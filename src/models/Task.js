import mongoose, { Schema } from 'mongoose';

const TaskSchema = new Schema({
  name: { type: String, required: true },
});

export default mongoose.model('Task', TaskSchema);
