import 'package:flutter/material.dart';

class AddPersonScreen extends StatefulWidget {
  const AddPersonScreen({super.key});

  @override
  State<AddPersonScreen> createState() => _AddPersonScreenState();
}

class _AddPersonScreenState extends State<AddPersonScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  DateTime? _selectedDate;
  int? _selectedYear;
  final List<String> _selectedAnchors = [];

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Birthday'),
        actions: [
          TextButton(
            onPressed: _save,
            child: const Text('Save'),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Name field
            TextFormField(
              controller: _nameController,
              autofocus: true,
              decoration: const InputDecoration(
                labelText: 'Name *',
                hintText: 'Enter person\'s name',
                border: OutlineInputBorder(),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Name is required';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),

            // Birthday date
            InkWell(
              onTap: _selectDate,
              child: InputDecorator(
                decoration: const InputDecoration(
                  labelText: 'Birthday *',
                  border: OutlineInputBorder(),
                ),
                child: Text(
                  _selectedDate == null
                      ? 'Select birthday'
                      : '${_selectedDate!.month}/${_selectedDate!.day}${_selectedYear != null ? '/${_selectedYear}' : ''}',
                  style: TextStyle(
                    color: _selectedDate == null ? Colors.grey : null,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Person anchors section
            Text(
              'Who knows ${_nameController.text.isEmpty ? 'this person' : _nameController.text}?',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: [
                _buildAnchorChip('Emily'),
                _buildAnchorChip('Jack'),
                _buildAnchorChip('Family'),
              ],
            ),
            const SizedBox(height: 24),

            // Optional fields (collapsed by default)
            ExpansionTile(
              title: const Text('Optional Details'),
              children: [
                ListTile(
                  title: const Text('Relationship'),
                  trailing: DropdownButton<String>(
                    value: null,
                    hint: const Text('Select...'),
                    items: const [
                      DropdownMenuItem(value: 'friend', child: Text('Friend')),
                      DropdownMenuItem(value: 'family', child: Text('Family')),
                      DropdownMenuItem(value: 'school', child: Text('School')),
                      DropdownMenuItem(value: 'work', child: Text('Work')),
                      DropdownMenuItem(value: 'neighbour', child: Text('Neighbour')),
                    ],
                    onChanged: (value) {
                      // TODO: Set relationship type
                    },
                  ),
                ),
                const ListTile(
                  title: TextField(
                    decoration: InputDecoration(
                      labelText: 'Notes',
                      hintText: 'e.g., likes dinosaurs',
                    ),
                    maxLines: 3,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: _save,
                  child: const Text('Save'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: FilledButton(
                  onPressed: _saveAndAddAnother,
                  child: const Text('Save & Add Another'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAnchorChip(String name) {
    final isSelected = _selectedAnchors.contains(name);
    return FilterChip(
      label: Text(name),
      selected: isSelected,
      onSelected: (selected) {
        setState(() {
          if (selected) {
            _selectedAnchors.add(name);
          } else {
            _selectedAnchors.remove(name);
          }
        });
      },
    );
  }

  Future<void> _selectDate() async {
    final now = DateTime.now();
    final date = await showDatePicker(
      context: context,
      initialDate: DateTime(now.year, now.month, now.day),
      firstDate: DateTime(1900),
      lastDate: DateTime(now.year + 1),
    );

    if (date != null) {
      setState(() {
        _selectedDate = date;
        _selectedYear = date.year;
      });
    }
  }

  void _save() {
    if (_formKey.currentState!.validate()) {
      if (_selectedDate == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please select a birthday')),
        );
        return;
      }

      // TODO: Save person to database
      Navigator.pop(context);
    }
  }

  void _saveAndAddAnother() {
    if (_formKey.currentState!.validate()) {
      if (_selectedDate == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please select a birthday')),
        );
        return;
      }

      // TODO: Save person to database

      // Clear form
      setState(() {
        _nameController.clear();
        _selectedDate = null;
        _selectedYear = null;
        _selectedAnchors.clear();
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Saved! Add another birthday')),
      );
    }
  }
}
