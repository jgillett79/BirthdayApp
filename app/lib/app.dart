import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class BirthdayApp extends StatelessWidget {
  const BirthdayApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Birthday Reminder',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.purple,
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.purple,
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      themeMode: ThemeMode.system,
      home: const Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.cake, size: 100, color: Colors.purple),
              SizedBox(height: 20),
              Text(
                'Birthday Reminder App',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 10),
              Text(
                'Complete redesign in progress...',
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
