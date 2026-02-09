-- Enable Realtime for kyc_verifications and vehicles tables
ALTER PUBLICATION supabase_realtime ADD TABLE kyc_verifications;
ALTER PUBLICATION supabase_realtime ADD TABLE vehicles;