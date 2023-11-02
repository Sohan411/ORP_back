const db = require('../db');

function addDevice(req, res) {
	const { device_uid, device_longitute, device_latitude, device_name, company_email } = req.body;
	try {
		const checkDeviceQuery = 'SELECT * FROM tms_devices WHERE device_uid = ?';
		const insertDeviceQuery = 'INSERT INTO tms_devices (device_uid, device_longitute, device_latitude, device_name, company_email) VALUES (?,?,?,?,?)';

		db.query(checkDeviceQuery, [device_uid], (error, checkResult) => {
		  if (error) {
		    console.error('Error while checking device:', error);
		    return res.status(500).json({ message: 'Internal server error' });
		  }

		  if (checkResult.length > 0) {
		    return res.status(400).json({ message: 'Device already added' });
		  }

		  db.query(insertDeviceQuery, [device_uid, device_longitute, device_latitude, device_name, company_email], (insertError, insertResult) => {
		    if (insertError) {
		      console.error('Error while inserting device:', insertError);
		      return res.status(500).json({ message: 'Internal server error' });
		    }

		    return res.json({ message: 'Device added successfully!' });
		  });
	});
	} catch (error) {
		console.error('Error in device check:', error);
		res.status(500).json({ message: 'Internal server error' });
	}	
}

function editDevice(req, res) {
  const { device_uid, device_longitute, device_latitude, device_name, company_email } = req.body;
  try {
    const updateDeviceQuery = 'UPDATE tms_devices SET device_longitute = ?, device_latitude = ?, device_name = ? WHERE device_uid = ?';

    db.query(updateDeviceQuery, [device_longitute, device_latitude, device_name, device_uid], (updateError, updateResult) => {
      if (updateError) {
        console.error('Error while updating device:', updateError);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Device not found' });
      }

      return res.json({ message: 'Device updated successfully!' });
    });
  } catch (error) {
    console.error('Error in device update:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

function deleteDevice(req, res) {
  const { device_uid } = req.body;
  try {
    const deleteDeviceQuery = 'DELETE FROM tms_devices WHERE device_uid = ?';

    db.query(deleteDeviceQuery, [device_uid], (deleteError, deleteResult) => {
      if (deleteError) {
        console.error('Error while deleting device:', deleteError);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Device not found' });
      }

      return res.json({ message: 'Device deleted successfully!' });
    });
  } catch (error) {
    console.error('Error in device deletion:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

function getDevicesByCompanyEmail(req, res) {
  const { company_email } = req.params;
  try {
    const fetchDevicesQuery = 'SELECT * FROM tms_devices WHERE company_email = ?';

    db.query(fetchDevicesQuery, [company_email], (fetchError, fetchResult) => {
      if (fetchError) {
        console.error('Error while fetching devices:', fetchError);
        return res.status(500).json({ message: 'Internal server error' });
      }

      return res.json({ devices: fetchResult });
    });
  } catch (error) {
    console.error('Error in device retrieval:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


module.exports = {
	addDevice,
	editDevice,
	deleteDevice,
	getDevicesByCompanyEmail
}