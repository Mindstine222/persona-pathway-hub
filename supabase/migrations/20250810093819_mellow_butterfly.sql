@@ .. @@
   -- Link any existing assessments with this user's email
   -- This needs to be done with elevated privileges
   UPDATE public.assessments 
   SET user_id = NEW.id 
   WHERE user_id IS NULL 
-    AND email = NEW.email;
+    AND LOWER(email) = LOWER(NEW.email);