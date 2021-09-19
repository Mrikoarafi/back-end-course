const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    profile: {
      wallet: {
        type: Number,
        default: 0,
        index: true,
      },
      name_users: {
        type: String,
        unique: true,
        required: true,
      },
      pict_users: {
        type: String,
        default: `default.jpg`,
      },
      bio: {
        type: String,
      },
      dateregist: { type: Date, default: Date.now() + 7 * 60 * 60 * 1000 },
    },
    contact: {
      number_users: {
        type: String,
        unique: true,
        index: true,
      },
      location: {
        type: String,
        required: true,
        index: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
    },
    shop: {
      trolly: {
        type: Array,
        default: null,
        index: true,
      },
      history: {
        buying: {
          type: Array,
          default: null,
          index: true,
        },
      },
    },
    access: {
      password: {
        type: String,
        required: true,
      },
      codeverify: {
        type: String,
        default: null,
      },
      verify: {
        type: Number,
        default: 0,
        description: '0 unverify,1 verify,2 change email',
      },
      level: {
        type: Number,
        default: 0,
        description: '0 users,1 admin',
      },
      refreshtoken: {
        type: String,
        default: null,
      },
      delete: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    versionKey: false,
  }
);
const courseSchema = new mongoose.Schema(
  {
    name_course: {
      type: String,
      unique: true,
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      index: true,
      default: 0,
    },
    description_course: {
      type: String,
      required: true,
    },
    pict_course: {
      type: String,
      default: `default_course.jpg`,
    },
    inserted_by: {
      type: String,
      required: true,
      index: true,
    },
    date_create_course: { type: Date, default: Date.now() + 7 * 60 * 60 * 1000 },
    date_update_course: { type: Date },
    delete: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  }
);
const Users = mongoose.model('users', userSchema);
const Courses = mongoose.model('courses', courseSchema);

module.exports = {
  Users,
  Courses,
};
