
import { Link } from "react-router-dom";

const Blog = () => {
  return (
    <div className="min-h-screen p-4">
      <div className="container max-w-4xl mx-auto pt-8">
        <h1 className="text-3xl font-semibold mb-8 text-center">Blog Articles</h1>
        <div className="space-y-6">
          {/* This section will be updated once you upload the HTML files */}
          <p className="text-center text-muted-foreground">
            Articles will be listed here once uploaded.
          </p>
        </div>
        <div className="mt-8 text-center">
          <Link 
            to="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Blog;
