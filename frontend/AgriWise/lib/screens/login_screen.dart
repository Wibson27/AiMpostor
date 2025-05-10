import 'dart:math';

import 'package:agriwise/services/auth_services.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fluttertoast/fluttertoast.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _obscurePassword = true;
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 100),
                const Center(
                  child: Column(
                    children: [
                      Text(
                        'Welcome Back!',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF3C8D40),
                        ),
                      ),
                      SizedBox(height: 10),
                      Text(
                        'Log in to manage your crops and\nget smart farming insights!',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Color(0xFF606060)),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
                const Text(
                  'Email Address',
                  style: TextStyle(
                    color: Color(0xFF000000),
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    height: 1.0,
                  ),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _emailController,
                  decoration: const InputDecoration(
                    hintText: 'Enter your email',
                  ),
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: 16),
                const Text(
                  'Password',
                  style: TextStyle(
                    color: Color(0xFF000000),
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    height: 1.0,
                  ),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  decoration: InputDecoration(
                    hintText: 'password',
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword
                            ? Icons.visibility_off_outlined
                            : Icons.visibility_outlined,
                        color: Color(0xFF606060),
                      ),
                      onPressed: () {
                        setState(() {
                          _obscurePassword = !_obscurePassword;
                        });
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                _signin(),
                const SizedBox(height: 70),
                const Row(
                  children: [
                    Expanded(child: Divider()),
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      child: Text(
                        'or continue with',
                        style: TextStyle(color: Colors.grey),
                      ),
                    ),
                    Expanded(child: Divider()),
                  ],
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _socialLoginButton(
                      onPressed: () {},
                      icon: SvgPicture.asset(
                        'assets/icons/devicon_google.svg',
                        width: 30,
                        height: 30,
                      ),

                      // color: Colors.white,
                    ),
                    const SizedBox(width: 16),
                    _socialLoginButton(
                      onPressed: () {},
                      icon: SvgPicture.asset(
                        'assets/icons/logos_facebook.svg',
                        width: 30,
                        height: 30,
                      ),
                      // icon: SvgPicture.asset('assets/images/Group.svg'),
                      // color: Colors.blue,
                    ),
                    const SizedBox(width: 16),
                    _socialLoginButton(
                      onPressed: () {},
                      // icon: SvgPicture.asset('assets/images/Group.svg'),
                      icon: SvgPicture.asset(
                        'assets/icons/apple.svg',
                        width: 30,
                        height: 30,
                      ),
                    ),
                    const SizedBox(width: 16),
                    _socialLoginButton(
                      onPressed: () {},
                      icon: SvgPicture.asset(
                        'assets/icons/x.svg',
                        width: 30,
                        height: 30,
                      ),
                      // icon: SvgPicture.asset('assets/images/Group.svg'),
                      // color: Colors.black,
                    ),
                  ],
                ),
                const SizedBox(height: 70),
                Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text('Don\'t have an account yet?'),
                      TextButton(
                        onPressed: () {
                          Navigator.pushNamed(context, '/register');
                        },
                        child: const Text(
                          'Sign Up',
                          style: TextStyle(color: Color(0xFF3C8D40)),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String? validateInput() {
    final email = _emailController.text.trim();
    final password = _passwordController.text;

    if (email.isEmpty) {
      return 'Email cannot be empty';
    }

    final emailRegex = RegExp(r'^[^@]+@[^@]+\.[^@]+');
    if (!emailRegex.hasMatch(email)) {
      return 'Please enter a valid email address';
    }

    if (password.isEmpty) {
      return 'Password cannot be empty';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  }

  Widget _signin() {
    return ElevatedButton(
      onPressed: () async {
        final errorMessage = validateInput();
        if (errorMessage != null) {
          Fluttertoast.showToast(
            msg: errorMessage,
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.BOTTOM,
          );
        }
        try {
          await AuthService().signin(
            email: _emailController.text,
            password: _passwordController.text,
          );
          await Future.delayed(const Duration(seconds: 1));
          Navigator.pushNamedAndRemoveUntil(
            context,
            '/home',
            (Route<dynamic> route) => false,
          );
        } catch (e) {
          Fluttertoast.showToast(
            msg: e.toString(),
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.BOTTOM,
          );
        }
      },
      child: const Text(
        'Login',
        style: TextStyle(
          fontFamily: 'Inter',
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Widget _socialLoginButton({
    required VoidCallback onPressed,
    required SvgPicture icon,
    bool appleIcon = false,
    // required Color color,
  }) {
    return InkWell(
      onTap: onPressed,
      child: Container(
        width: 50,
        height: 50,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: Colors.grey.shade300),
        ),
        child: Center(child: icon),
      ),
    );
  }
}
