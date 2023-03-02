import 'package:flutter/material.dart';

const _version = '0.0.4';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PWA push notifications via JS',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(appVersion: _version),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.appVersion});

  final String appVersion;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('PWA push notifications via JS'),
      ),
      body: Center(
        child: Text(
          'App version: ${widget.appVersion}',
          style: Theme.of(context).textTheme.headlineMedium,
        ),
      ),
    );
  }
}
