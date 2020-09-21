module.exports = (mongoose, mongoosePaginate) => {
  var AppStatus = Object.freeze({
    Applied: 'Applied',
    Rejected: 'Rejected',
    CodingRound: 'Coding Round',
    PhoneScreen: 'Phone Screen',
    OnSite: 'On-Site',
    Offer: 'Offer',
  });

  var ApplicationSchema = mongoose.Schema({
    companyName: String,
    position: String,
    dateOfApplication: Date,
    lastUpdate: Date,
    status: {
      type: String,
      enum : ['Applied', 'Rejected', 'Coding Round', 'Phone Screen', 'On-Site', 'Offer'],
      default: 'Applied'
      },
    // status: String,
    notes: String
  });

  ApplicationSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  Object.assign(ApplicationSchema.statics, {
    AppStatus,
  });
  ApplicationSchema.plugin(mongoosePaginate);
  
  const Application = mongoose.model("application", ApplicationSchema);
  
  // Application.paginate({}, {offset: 3, limit: 2})
  // .then(result => {})
  // .catch(error => {}) ;

  return Application;
};
