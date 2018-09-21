

exports.firstUpperCase = function (str) {
  return str.replace(/\b(\w)/g, function($1) {
    return $1.toUpperCase()
  })
} 
