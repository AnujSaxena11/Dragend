import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  envType: {
    type: String,
    required: true,
    enum: ['local', 'deployed'],
  },

  authType: {
    type: String,
    required: true,
    enum: ['credentials', 'uri'],
  },

  credentials: {
    uri: {
      type: String,
      required: function () {
        return this.authType === 'uri';
      },
    },

    host: {
      type: String,
      required: function () {
        return this.authType === 'credentials';
      },
    },

    port: {
      type: Number,
      required: function () {
        return this.authType === 'credentials';
      },
    },

    username: {
      type: String,
      required: function () {
        return this.authType === 'credentials';
      },
    },

    password: {
      type: String,
      required: function () {
        return this.authType === 'credentials';
      },
    },

    serviceName: {
      type: String,
      required: false,
    },
  },
});

const DB_Config = mongoose.models.DB_Config || mongoose.model('DB_Config', configSchema);

export default DB_Config;