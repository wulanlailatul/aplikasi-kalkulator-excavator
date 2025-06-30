import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { usehandleLogin } from '@/hooks/use-store-login'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { NavigationStackParamList } from '@/screen/main-navigator' // Pastikan path ini benar

const Login = () => {
  const {
    email,
    password,
    setEmail,
    setPassword,
    setIsLoggedIn,
  } = usehandleLogin()

  const navigation = useNavigation<NativeStackNavigationProp<NavigationStackParamList>>()

  const emailLogin = 'Insoper_UT'
  const passwordLogin = 'dediKASI'

  const handleLogin = () => {
    if (email === emailLogin && password === passwordLogin) {
      setIsLoggedIn(true)
      navigation.replace('Home')
    } else {
      alert('Email atau password salah')
    }
  }

  return (
    <View className="justify-center items-center h-full bg-yellow-50">
      {/* Gambar Atas - Diperbesar */}
      <View className="items-center mb-6">
        <Image
          source={require('@/assets/logout.png')} // Ganti path sesuai gambar kamu
          style={{ width: 180, height: 180, resizeMode: 'contain' }} // <-- Diperbesar
        />
      </View>

      {/* Form Login */}
      <View className="w-[90%]">
        <TextInput
          placeholder="Username"
          className="border rounded-lg w-full mt-5 p-3 bg-white text-gray-900"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          className="border rounded-lg w-full mt-5 p-3 bg-white text-gray-900"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          className="w-full py-3 bg-yellow-400 mt-5 rounded-lg"
          onPress={handleLogin}
        >
          <Text className="text-center font-bold text-gray-900">Login</Text>
        </TouchableOpacity>
      </View>

      {/* Gambar Bawah - Diperkecil */}
      <View className="mt-20 items-center">
        <Image
          source={require('@/assets/movingasone.png')} // Ganti path sesuai gambar kamu
          style={{ width: 100, height: 70, resizeMode: 'contain' }} // <-- Diperkecil
        />
        <Text className="text-xs text-gray-500">Powered by Excavator Insight</Text>
      </View>
    </View>
  )
}

export default Login
