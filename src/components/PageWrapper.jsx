// src/components/PageWrapper.jsx
export default function PageWrapper({ children }) {
    return (
      <div className="p-6 max-w-screen-xl mx-auto w-full">
        {children}
      </div>
    );
  }  