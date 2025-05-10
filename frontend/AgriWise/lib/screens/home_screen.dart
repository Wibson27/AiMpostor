import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_svg/flutter_svg.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;
  @override
  Widget build(BuildContext context) {
    // Get current date
    final now = DateTime.now();
    final dateFormat = DateFormat('EEEE, dd MMM yyyy');
    final formattedDate = dateFormat.format(now);
    final String? username = FirebaseAuth.instance.currentUser?.displayName;
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      body: Stack(
        children: [
          // Green header-*22
          Container(
            height: MediaQuery.of(context).size.height,
            padding: const EdgeInsets.fromLTRB(20, 60, 20, 30),
            color: const Color(0xFF3C8D40),
            width: double.infinity,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                RichText(
                  text: TextSpan(
                    text: 'Hello, ',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.normal,
                    ),
                    children: [
                      TextSpan(
                        text:
                            username != null
                                ? '${username[0].toUpperCase()}${username.substring(1)}!'
                                : 'User',
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  formattedDate,
                  style: const TextStyle(color: Colors.white, fontSize: 16),
                ),
              ],
            ),
          ),

          // Features section
          Positioned(
            top: 200,
            left: 0,
            right: 0,
            bottom: 0,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(40),
                  topRight: Radius.circular(40),
                ),
              ),
              padding: const EdgeInsets.fromLTRB(16, 31, 20, 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(left: 8),
                    child: const Text(
                      'Features',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xff232323),
                      ),
                    ),
                  ),
                  // Feature grid
                  Expanded(
                    child: GridView.count(
                      crossAxisCount: 2,
                      childAspectRatio: 1.2,
                      crossAxisSpacing: 8,
                      mainAxisSpacing: 8,
                      children: [
                        _buildFeatureCard(
                          title: 'Disease Detection',
                          iconData: SvgPicture.asset(
                            'assets/icons/disease_detection.svg',
                          ),
                          onTap: () {},
                        ),
                        _buildFeatureCard(
                          title: 'Pest Forecast',
                          iconData: SvgPicture.asset(
                            'assets/icons/pest_forecast.svg',
                          ),
                          onTap: () {},
                        ),
                        _buildFeatureCard(
                          title: 'Seeding Quality',
                          iconData: SvgPicture.asset(
                            'assets/icons/seeding_quality.svg',
                          ),
                          onTap: () {},
                        ),
                        _buildFeatureCard(
                          title: 'Fertilizer Recipe',
                          iconData: SvgPicture.asset(
                            'assets/icons/ferilizer_recipe.svg',
                          ),
                          onTap: () {},
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        backgroundColor: Colors.white,
        shadowColor: Colors.black,
        elevation: 100, // Adjusted elevation to match the shadow intensity
        destinations: [
          NavigationDestination(
            icon: Icon(
              Icons.home,
              color: _selectedIndex == 0 ? Colors.green : Colors.black,
            ),
            label: "Home",
          ),
          NavigationDestination(
            icon: Icon(
              Icons.person,
              color: _selectedIndex == 1 ? Colors.green : Colors.black,
            ),
            label: "Profile",
          ),
        ],
        onDestinationSelected: (int value) {
          setState(() {
            _selectedIndex = value;
          });
        },
        selectedIndex: _selectedIndex,
      ),
    );
  }

  Widget _buildFeatureCard({
    required String title,
    required SvgPicture iconData,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 0,
      color: Colors.white, // Set the card background color to white
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Color(0xffC9C9C9)),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              iconData,
              const SizedBox(height: 12),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
