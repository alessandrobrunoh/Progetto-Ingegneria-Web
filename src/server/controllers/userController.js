const getUserData = (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    avatar: req.user.avatar
  });
};




module.exports = { getUserData };
