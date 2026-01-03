const Footer = () => {
  return (
    <footer className="border-t border-border/10 py-6 mt-auto bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 text-center space-y-2">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} NeuLife. All rights reserved.
        </p>
        <p className="text-muted-foreground text-xs">
          Developed by Future Engineer: Hari Vissa & Future Doctor: Michelle Manda
        </p>
      </div>
    </footer>
  );
};

export { Footer };
