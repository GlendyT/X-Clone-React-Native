export const protectRoute = async (req, res, next) => {
  try {
    const auth = req.auth();
    
    if (!auth.isAuthenticated) {
      return res
        .status(401)
        .json({ message: "Unauthorized - you must be logged in" });
    }
    
    next();
  } catch (error) {

    return res.status(401).json({ message: "Authentication error" });
  }
};
