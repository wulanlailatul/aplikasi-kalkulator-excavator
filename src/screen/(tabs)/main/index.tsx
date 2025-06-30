import React from 'react';
import {ScrollView, SafeAreaView, View} from 'react-native';
import Home from './_components/home';
import {Summary} from './_components/summary';
import Process from './_components/proses';
import {useStoreState} from './_components/home';

const Index = () => {
  const {start,summary} = useStoreState();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f9fafb'}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Home />
        {start && (
            <Process /> 
            
         
        )}
        {summary && (
          <Summary />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
