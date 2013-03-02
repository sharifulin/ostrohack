module.exports = {
  plural: function(value){
    var pluralForm = 0;
    var value = value || 0;
    if (value % 10 == 1 && value != 11)
      pluralForm = 1;
    else if (value % 10 > 1 && value % 10 < 5 && (value < 10 || value > 20))
      pluralForm = 2;
    else
      pluralForm = 3;              

    return pluralForm;
  }
}