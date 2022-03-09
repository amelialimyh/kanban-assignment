
exports.register = (req, res) => {
    console.log(req.body);

    // destructure new_user form variables
    const { name, email, password, passwordConfirm } = req.body;

    res.send("Form submitted");
}