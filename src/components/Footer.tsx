import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg text-primary mb-1">ErrandRunner</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted delivery partner
            </p>
          </div>
          
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/admin" className="hover:text-primary transition-colors">
              Admin
            </Link>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ErrandRunner. All rights reserved.
        </div>
      </div>
    </footer>
  );
};