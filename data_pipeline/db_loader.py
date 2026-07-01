from pymongo import MongoClient

# Use the exact non-SRV connection string that bypasses the DNS bug!
MONGO_URI = "mongodb://keoteakash:Akash%40db123@cluster0-shard-00-00.jl5jf.mongodb.net:27017,cluster0-shard-00-01.jl5jf.mongodb.net:27017,cluster0-shard-00-02.jl5jf.mongodb.net:27017/subsidy_db?ssl=true&replicaSet=atlas-13g8ac-shard-0&authSource=admin&retryWrites=true&w=majority"

def upload_to_mongodb(scheme_data):
    if not scheme_data:
        return
        
    try:
        print(f"🚀 Uploading '{scheme_data.get('title')}' to MongoDB...")
        client = MongoClient(MONGO_URI)
        db = client['subsidy_db']
        collection = db['subsidies']
        
        # Use upsert to update existing schemes or insert new ones
        result = collection.update_one(
            {"title": scheme_data.get("title")},
            {"$set": scheme_data},
            upsert=True
        )
        
        if result.upserted_id:
            print(f"✅ Successfully inserted new scheme into Database!")
        else:
            print(f"🔄 Successfully updated existing scheme in Database!")
            
    except Exception as e:
        print(f"❌ Database Upload Failed: {e}")
    finally:
        client.close()
