// Icon.jsx
import * as icons from 'react-bootstrap-icons';

const Icon = ({ iconName, className, ...props }) => {
  const BootstrapIcon = icons[iconName];

  if (!BootstrapIcon) {
    console.error(`Icon "${iconName}" does not exist in react-bootstrap-icons.`);
    return null;
  }

  return <BootstrapIcon {...props} className={className} />;
};

export default Icon; // Ensure you're using default export
