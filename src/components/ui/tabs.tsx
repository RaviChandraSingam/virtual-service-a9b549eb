import * as React from 'react';
import MuiTabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const TabsContext = React.createContext({ value: '', onChange: (v) => {} });

function Tabs({ defaultValue, value: controlledValue, onValueChange, children, className }) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const onChange = (v) => { setInternalValue(v); if (onValueChange) onValueChange(v); };
  return (
    <TabsContext.Provider value={{ value, onChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ children, className }) {
  const { value, onChange } = React.useContext(TabsContext);
  const tabs = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) tabs.push(child);
  });
  return (
    <MuiTabs value={value} onChange={(_, v) => onChange(v)} className={className}>
      {tabs.map((t) => (
        <Tab key={t.props.value} label={t.props.children} value={t.props.value} />
      ))}
    </MuiTabs>
  );
}

function TabsTrigger({ value, children }) { return null; }

function TabsContent({ value, children, className }) {
  const { value: active } = React.useContext(TabsContext);
  if (active !== value) return null;
  return <div className={className}>{children}</div>;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
