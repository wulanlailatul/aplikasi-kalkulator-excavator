import React, { createContext, useContext, useState } from 'react';

const TabVisibilityContext = createContext({
  visible: true,
  setVisible: (_val: boolean) => {},
});

export const useTabVisibility = () => useContext(TabVisibilityContext);

export const TabVisibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(true);

  return (
    <TabVisibilityContext.Provider value={{ visible, setVisible }}>
      {children}
    </TabVisibilityContext.Provider>
  );
};
