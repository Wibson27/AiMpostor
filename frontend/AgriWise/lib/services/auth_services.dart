import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class AuthService {
  // signIn
  Future<void> signin({required String email, required String password}) async {
    try {
      await FirebaseAuth.instance.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
    } on FirebaseAuthException catch (e) {
      switch (e.code) {
        case 'invalid-credential':
          throw 'Invalid email or password.';
        case 'user-disabled':
          throw 'This user account has been disabled.';
        case 'user-not-found':
          throw 'No user found for that email.';
        case 'too-many-requests':
          throw 'Too many login attempts. Please try again later.';
        case 'wrong-password':
          throw 'Wrong password for the user.';
        default:
          throw 'Login failed Please check your email and password.';
      }
    } catch (e) {
      throw Exception('Error signing in: $e');
    }
  }

  // signUP
  Future<void> signup({
    required String name,
    required String email,
    required String password,
    required String confirmationPassword,
    required bool agreedToTerms,
  }) async {
    try {
      UserCredential userCredentials = await FirebaseAuth.instance
          .createUserWithEmailAndPassword(email: email, password: password);
      await userCredentials.user?.updateProfile(displayName: name);
    } on FirebaseAuthException catch (e) {
      if (e.code == 'weak-password') {
        throw 'The password provided is too weak.';
      } else if (e.code == 'email-already-in-use') {
        throw 'An account already exists with that email.';
      } else {
        throw 'An error occurred. Please try again.';
      }
    } catch (e) {
      throw Exception('Error signing up: $e');
    }
    // save user data to Firestore or Realtime Database
    // await FirebaseFirestore.instance
    //     .collection('users')
    //     .doc(userCredentials.user?.uid)
    //     .set({
    //   'name': name,
    //   'email': email,
    //   'createdAt': Timestamp.now(),
    // });
    // });
  }

  Future<void> signout({required BuildContext context}) async {
    await FirebaseAuth.instance.signOut();
    Navigator.pushNamedAndRemoveUntil(
      context,
      '/splash',
      (Route<dynamic> route) => false,
    );
  }
}
