import 'package:agriwise/screens/disease_detection/chatbot_screen.dart';
import 'package:agriwise/services/http_service.dart';
import 'package:agriwise/widgets/disease_history_drawer.dart';
import 'package:flutter/material.dart';
import 'package:agriwise/screens/disease_detection/photo_preview_screen.dart';
import 'package:image_picker/image_picker.dart';
import 'package:flutter_svg/flutter_svg.dart';

import 'package:agriwise/screens/home_screen.dart';
import 'package:agriwise/screens/profile_screen.dart';

class DiseaseDetectionScreen extends StatefulWidget {
  const DiseaseDetectionScreen({super.key});

  @override
  State<DiseaseDetectionScreen> createState() => _DiseaseDetectionScreenState();
}

class _DiseaseDetectionScreenState extends State<DiseaseDetectionScreen> {
  final int _selectedIndex = 0; // 0 for Home since this is not Profile

  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  final ImagePicker _picker = ImagePicker();
  final List<dynamic> _history = [];

  @override
  void initState() {
    super.initState();
    _fetchHistory();
  }

  Future<void> _fetchHistory() async {
    try {
      final history = await HttpService().getChatHistory();
      setState(() {
        _history.addAll(history);
      });
    } catch (e) {
      // Handle error
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error fetching history: $e')));
    } finally {
      if (_history.isNotEmpty) {
        for (var chat in _history) {
          final createdAt = chat['createdAt'];
          if (createdAt != null && createdAt['_seconds'] != null) {
            final date = DateTime.fromMillisecondsSinceEpoch(
              createdAt['_seconds'] * 1000,
            );
            final formattedDate =
                '${date.day} - ${date.month.toString().padLeft(2, '0')}';
            chat['formattedDate'] = formattedDate;
          }
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: const Color(0xFFF7F7F7),
        elevation: 0,
        centerTitle: true,
        title: const Text(
          'Disease Detection',
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.w500,
            fontSize: 18,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const HomeScreen()),
            );
          },
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.history, color: Colors.black),
            onPressed: () {
              _scaffoldKey.currentState?.openEndDrawer();
            },
          ),
        ],
      ),
      endDrawer: DiseaseHistoryDrawer(
        history: _history,
        onHistoryItemTap: (chatId) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => ChatbotScreen(chatId: chatId),
            ),
          );
        },
      ),
      body: _buildInitialScreen(),
      bottomNavigationBar: _buildBottomNavBar(),
    );
  }

  // Initial screen with camera and album options
  Widget _buildInitialScreen() {
    return Align(
      alignment: Alignment.topCenter,
      child: Container(
        width: 361,
        height: 528,
        margin: EdgeInsets.only(top: 36),
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(25),
          border: Border.all(color: Color(0xffA8A8A8), width: 1),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 20),
            const Text(
              'Scan your plant to identify\ndisease',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),
            Container(
              width: double.infinity,
              height: 246,
              padding: EdgeInsets.only(top: 25),
              decoration: BoxDecoration(
                color: const Color(0x264CAF50),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: const Color(0x264CAF50),
                  width: 1,
                  style: BorderStyle.none,
                ),
              ),
              margin: const EdgeInsets.symmetric(horizontal: 5),
              child: Column(
                children: [
                  const SizedBox(height: 40),
                  Container(
                    width: 60,
                    height: 60,
                    margin: EdgeInsets.only(bottom: 2),
                    color: const Color(0x004CAF50),
                    child: SvgPicture.asset(
                      'assets/icons/camera.svg',
                      width: 56,
                      height: 56,
                    ),
                  ),
                  const SizedBox(height: 20),
                  // Take Photo button
                  SizedBox(
                    width: 152,
                    height: 41,
                    child: ElevatedButton(
                      onPressed: () => _takePhoto(),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF307C42),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        'Take Photo',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
            const SizedBox(height: 30),

            Row(
              children: [
                Expanded(
                  child: Container(height: 1, color: Colors.grey.shade300),
                ),
                SizedBox(width: 8), // control spacing between line and "or"
                Text(
                  'or',
                  style: TextStyle(color: Colors.grey.shade500, fontSize: 14),
                ),
                SizedBox(width: 8), // control spacing between "or" and line
                Expanded(
                  child: Container(height: 1, color: Colors.grey.shade300),
                ),
              ],
            ),

            const SizedBox(height: 15),
            SizedBox(
              width: 216,
              height: 41,
              child: OutlinedButton(
                onPressed: () => _pickImage(),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Color(0xFF3C8D40)),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text(
                  'Choose from album',
                  style: TextStyle(
                    color: Color(0xFF3C8D40),
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Take a photo using camera
  Future<void> _takePhoto() async {
    try {
      final XFile? photo = await _picker.pickImage(source: ImageSource.camera);
      if (photo != null) {
        _navigateToPreview(photo);
      }
    } catch (e) {
      // Handle camera error
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Camera error: $e')));
    }
  }

  // Pick image from gallery
  Future<void> _pickImage() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
      if (image != null) {
        _navigateToPreview(image);
      }
    } catch (e) {
      // Handle gallery error
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Gallery error: $e')));
    }
  }

  // Navigate to preview screen with selected image
  void _navigateToPreview(XFile imageFile) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PhotoPreviewScreen(imageFile: imageFile),
      ),
    );
  }

  // History drawer - uses standard Flutter Drawer widget
  Widget _buildHistoryDrawer() {
    return Drawer(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.fromLTRB(20, 50, 20, 20),
            child: const Row(
              children: [
                Icon(Icons.history, size: 24),
                SizedBox(width: 10),
                Text(
                  'History',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: Text(
              'Recent',
              style: TextStyle(color: Colors.grey, fontSize: 14),
            ),
          ),
          const SizedBox(height: 10),

          // Static data for now
          ListTile(
            title: const Text(
              'How serious is B...',
              style: TextStyle(color: Colors.black, fontSize: 16),
            ),
            onTap: () {
              Navigator.pop(context);
              // Navigate to chatbot with the chat ID
            },
          ),
        ],
      ),
    );
  }

  // Bottom navigation bar
  Widget _buildBottomNavBar() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            spreadRadius: 2,
            blurRadius: 8,
            offset: Offset(0, -1),
          ),
        ],
        border: Border(top: BorderSide(color: Colors.grey.shade300, width: 1)),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 15),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildNavItem(Icons.home, 'Home', true),
            _buildNavItem(Icons.person, 'Profile', false),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, bool isSelected) {
    final color = isSelected ? const Color(0xFF3C8D40) : Colors.grey;

    return GestureDetector(
      onTap: () {
        if (label == 'Home') {
          if (_selectedIndex != 0) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const HomeScreen()),
            );
          }
        } else if (label == 'Profile') {
          if (_selectedIndex != 1) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const ProfileScreen()),
            );
          }
        }
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: color),
          const SizedBox(height: 4),
          Text(label, style: TextStyle(color: color, fontSize: 12)),
        ],
      ),
    );
  }
}
