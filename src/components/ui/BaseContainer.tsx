import 'styles/ui/BaseContainer.scss';
import PropTypes from "prop-types";
import React from 'react';

interface BaseContainerProps {
  className?: string;
  children: React.ReactNode;
}

const BaseContainer = ({ className = '', children }: BaseContainerProps) => (
  <div className={`base-container ${className}`}>
    {children}
  </div>
);

BaseContainer.propTypes = {
  children: PropTypes.node,
};

export default BaseContainer;